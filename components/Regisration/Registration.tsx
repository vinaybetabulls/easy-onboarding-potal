// components/RegistrationCard.tsx
'use client';

import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Dropzone from 'react-dropzone';
import { useState } from 'react';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  nationalId: z.string().min(5, 'National ID is required'),
  about: z.string().min(10, 'Tell us more about yourself'),
});

type FormData = z.infer<typeof formSchema>;

export default function RegistrationCard() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { about: '' },
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: watch('about'),
    autofocus: true,
    editable: true,
    onUpdate: ({ editor }) => {
      setValue('about', editor.getHTML());
      trigger('about');
    },
  });

  const handleFileInsert = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      if (file.type.startsWith('image/')) {
        editor?.chain().focus().setImage({ src: base64 }).run();
        setUploadedFiles((prev) => [...prev, file]);
      } else if (file.type === 'application/pdf') {
        const linkHTML = `
          <p class='text-sm border border-blue-100 rounded p-2 bg-blue-50 text-blue-700'>
            📄 ${file.name}
          </p><p></p>`;
        editor?.chain().focus().insertContent(linkHTML).run();
        setUploadedFiles((prev) => [...prev, file]); // store real file
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => handleFileInsert(file));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();

      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('nationalId', data.nationalId);
      formData.append('about', data.about);

      // 📦 Append actual tracked files
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:4000/api/onboard', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit form');

      const result = await response.json();
      alert('Form submitted successfully!');
      console.log('Response from service A:', result);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Submission failed. Check console.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-xl shadow-md rounded-2xl border border-gray-200">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Onboarding form</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register('firstName')} placeholder="John" />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} placeholder="Doe" />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...register('phone')} placeholder="+1234567890" />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="nationalId">National Identity</Label>
              <Input id="nationalId" {...register('nationalId')} placeholder="A123456789" />
              {errors.nationalId && (
                <p className="text-sm text-red-500 mt-1">{errors.nationalId.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="about">About you and Upload Files (Rich Text + Files)</Label>
              <Dropzone onDrop={onDrop} accept={{ 'application/pdf': [], 'image/*': [] }}>
                {({ getRootProps, getInputProps }) => (
                  <div className="border rounded-md bg-white px-4 py-2 min-h-[160px] focus-within:ring-2 ring-primary">
                    <div {...getRootProps()} className="cursor-pointer mb-2">
                      <input {...getInputProps()} />
                      <p className="text-xs text-gray-500">
                        Click or drag & drop to insert PDFs or Images
                      </p>
                    </div>
                    <EditorContent
                      editor={editor}
                      className="prose max-w-none focus:outline-none min-h-[120px]"
                    />
                  </div>
                )}
              </Dropzone>
              {errors.about && <p className="text-sm text-red-500 mt-1">{errors.about.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
