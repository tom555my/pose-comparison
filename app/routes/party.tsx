import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, Camera, Loader2, RefreshCw } from "lucide-react";
import type { Route } from "./+types/party";
import { comparePoses } from "../lib/gemini.server";

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const targetImage = formData.get("targetImage") as File;
  const attemptImage = formData.get("attemptImage") as File;

  // @ts-ignore
  const apiKey = context.cloudflare.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { error: "API Key not configured on server." };
  }

  if (!targetImage || !attemptImage) {
    return { error: "Both images are required!" };
  }

  try {
    const result = await comparePoses(targetImage, attemptImage, apiKey);
    return { result };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong comparing the poses." };
  }
}

export default function Party() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [targetPreview, setTargetPreview] = useState<string | null>(null);
  const [attemptPreview, setAttemptPreview] = useState<string | null>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (targetPreview) URL.revokeObjectURL(targetPreview);
      if (attemptPreview) URL.revokeObjectURL(attemptPreview);
    };
  }, [targetPreview, attemptPreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (url: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const reset = () => {
    setTargetPreview(null);
    setAttemptPreview(null);
    window.location.reload(); // Simple reset
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-pink-500 selection:text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tighter"
          >
            POSE OFF!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg"
          >
            Can you recreate the masterpiece?
          </motion.p>
        </div>

        {/* Action Area */}
        <Form method="post" encType="multipart/form-data" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Target Upload */}
            <ImageUploadField
              name="targetImage"
              label="The Target"
              description="Upload the master pose here."
              preview={targetPreview}
              onChange={(e) => handleImageChange(e, setTargetPreview)}
            />

            {/* Attempt Upload */}
            <ImageUploadField
              name="attemptImage"
              label="The Attempt"
              description="Upload your team's recreation."
              preview={attemptPreview}
              onChange={(e) => handleImageChange(e, setAttemptPreview)}
            />
          </div>

          <div className="flex justify-center pt-4">
            {actionData?.result ? (
              <button
                type="button"
                onClick={reset}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-neutral-800 px-8 font-medium text-white transition-all duration-300 hover:bg-neutral-700 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="mr-2 h-5 w-5" /> Play Again
              </button>
            ) : (
              <button
                type="submit"
                disabled={!targetPreview || !attemptPreview || isSubmitting}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-10 font-bold text-black transition-all duration-300 hover:bg-pink-500 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <span className="relative flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" /> Judging...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" /> Compare Poses
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </Form>

        {/* Results Area */}
        <AnimatePresence>
          {actionData?.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center"
            >
              <AlertCircle className="inline-block mr-2 w-5 h-5 mb-1" />
              {actionData.error}
            </motion.div>
          )}

          {actionData?.result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-8 md:p-12 text-center"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

              <div className="space-y-6">
                <div className="text-sm font-medium tracking-wider text-neutral-400 uppercase">Similarity Score</div>
                <div className="text-8xl md:text-9xl font-black text-white tabular-nums tracking-tighter">
                  {actionData.result.score}%
                </div>

                <div className="h-4 w-full max-w-lg mx-auto bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${actionData.result.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  />
                </div>

                <p className="text-xl md:text-2xl text-purple-200 font-medium max-w-2xl mx-auto leading-relaxed">
                  "{actionData.result.feedback}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function ImageUploadField({
  name,
  label,
  description,
  preview,
  onChange
}: {
  name: string;
  label: string;
  description: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {label}
        </h2>
        <p className="text-neutral-400 text-sm">{description}</p>
      </div>

      <label className={`
                relative group flex flex-col items-center justify-center w-full aspect-[4/3] 
                rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer
                ${preview ? 'border-transparent bg-neutral-900' : 'border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-500'}
            `}>
        <input
          type="file"
          name={name}
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />

        {preview ? (
          <>
            <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" /> Change Image
              </div>
            </div>
            <CheckCircle className="absolute top-4 right-4 text-green-500 w-8 h-8 drop-shadow-lg" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-neutral-400 group-hover:text-pink-400 transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-neutral-200">Click to upload</p>
              <p className="text-xs text-neutral-500">JPG, PNG, WebP</p>
            </div>
          </div>
        )}
      </label>
    </div>
  );
}
