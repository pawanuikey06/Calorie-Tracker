import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface FoodImageUploadProps {
  onFoodRecognized: (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}

const FoodImageUpload: React.FC<FoodImageUploadProps> = ({ onFoodRecognized }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setCroppedImage(null);
        setIsCropping(false);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const getCroppedImg = (imageSrc: string, crop: Crop): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          );
        }

        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  };

  const handleCropComplete = async () => {
    if (image && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(image, crop);
      setCroppedImage(croppedImageUrl);
      setIsCropping(false);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "OpenRouter API key is not configured. Please check your .env file.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert image to base64 if it's not already
      const imageData = croppedImage || image;
      const base64Image = imageData.split(',')[1]; // Remove data URL prefix

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Calorie Tracker',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this food image and provide the following information in JSON format ONLY:\n" +
                        "- name: The name of the food\n" +
                        "- calories: Estimated calories per serving\n" +
                        "- protein: Grams of protein\n" +
                        "- carbs: Grams of carbohydrates\n" +
                        "- fat: Grams of fat\n\n" +
                        "Return ONLY the JSON object, no other text."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response structure');
      }

      const content = data.choices[0].message.content;
      let foodData;

      try {
        // Try to parse the entire response as JSON first
        foodData = JSON.parse(content);
      } catch (error) {
        // If that fails, try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        foodData = JSON.parse(jsonMatch[0]);
      }

      // Validate the food data
      if (!foodData.name || !foodData.calories || !foodData.protein || !foodData.carbs || !foodData.fat) {
        throw new Error('Incomplete food data from AI');
      }

      // Round numerical values
      foodData.calories = Math.round(foodData.calories);
      foodData.protein = Math.round(foodData.protein * 10) / 10;
      foodData.carbs = Math.round(foodData.carbs * 10) / 10;
      foodData.fat = Math.round(foodData.fat * 10) / 10;

      console.log('AI recognized food data:', foodData);
      onFoodRecognized(foodData);
      setImage(null);
      setCroppedImage(null);
      setIsCropping(false);
      
      toast({
        title: "Food analyzed successfully",
        description: `Detected: ${foodData.name}`,
      });
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      
      let errorMessage = "Please try again with a clearer image";
      
      if (error.response?.status === 401) {
        errorMessage = "Invalid API key. Please check your OpenRouter API key configuration.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid request format. Please try with a different image.";
      } else if (error.response?.status === 413) {
        errorMessage = "Image file is too large. Please try a smaller image.";
      }

      toast({
        title: "Error analyzing image",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!image ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to select a file
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isCropping ? (
              <>
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  aspect={1}
                >
                  <img
                    src={image}
                    alt="Food"
                    className="max-w-full rounded-lg"
                  />
                </ReactCrop>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCropComplete}
                    variant="outline"
                    className="flex-1"
                  >
                    Apply Crop
                  </Button>
                  <Button
                    onClick={() => setIsCropping(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel Crop
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <img
                    src={croppedImage || image}
                    alt="Food"
                    className="max-w-full rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={analyzeImage}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Food'}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsCropping(true)}
                      variant="outline"
                      className="flex-1"
                      disabled={loading}
                    >
                      Crop Image
                    </Button>
                    <Button
                      onClick={() => {
                        setImage(null);
                        setCroppedImage(null);
                        setIsCropping(false);
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={loading}
                    >
                      Change Image
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodImageUpload; 