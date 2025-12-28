import { experimental_useObject as useObject } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Sparkles, Trophy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ResponseSchema } from '../lib/schema';

// Helper to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Party() {
  // UI Local State
  const [targetPreview, setTargetPreview] = useState<string | null>(null);
  const [attemptPreview, setAttemptPreview] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // File refs for access during submit
  const targetFileRef = useRef<File | null>(null);
  const attemptFileRef = useRef<File | null>(null);

  // useObject hook from AI SDK
  const { object, submit, isLoading, error, stop } = useObject({
    api: '/api/compare',
    schema: ResponseSchema,
  });

  useEffect(() => {
    return () => {
      if (targetPreview) URL.revokeObjectURL(targetPreview);
      if (attemptPreview) URL.revokeObjectURL(attemptPreview);
    };
  }, [targetPreview, attemptPreview]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
    fileRef: React.MutableRefObject<File | null>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      fileRef.current = file;
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!targetFileRef.current || !attemptFileRef.current) return;

    setShowResults(true);

    // Convert files to base64
    const [targetBase64, attemptBase64] = await Promise.all([
      fileToBase64(targetFileRef.current),
      fileToBase64(attemptFileRef.current),
    ]);

    // Submit to useObject
    submit({
      targetImage: {
        data: targetBase64,
        type: targetFileRef.current.type,
      },
      attemptImage: {
        data: attemptBase64,
        type: attemptFileRef.current.type,
      },
    });
  };

  const reset = () => {
    setTargetPreview(null);
    setAttemptPreview(null);
    targetFileRef.current = null;
    attemptFileRef.current = null;
    window.location.reload();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <header className="text-center space-y-4 pt-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block"
          >
            <h1 className="text-6xl md:text-8xl italic">
              Pose Off<span className="text-purple-600 not-italic ml-5">!</span>
            </h1>
          </motion.div>
          <p className="text-xl font-sans opacity-80">
            (｡•̀ᴗ-)✧ Time to recreate the masterpiece. The AI is watching.
          </p>
        </header>

        {/* Main Interface */}
        <form
          onSubmit={handleSubmit}
          className="space-y-10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Target Card */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="bg-white/80 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border border-black/5">
                  The Target
                </span>
              </div>
              <ImageUploadCard
                name="targetImage"
                preview={targetPreview}
                onChange={(e) => handleImageChange(e, setTargetPreview, targetFileRef)}
                emptyLabel="Upload the Goal"
                emoji="🎯"
              />
            </div>

            {/* Attempt Card */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="bg-white/80 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border border-black/5">
                  Your Attempt
                </span>
              </div>
              <ImageUploadCard
                name="attemptImage"
                preview={attemptPreview}
                onChange={(e) => handleImageChange(e, setAttemptPreview, attemptFileRef)}
                emptyLabel="Upload the Fail"
                emoji="📸"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center pb-12">
            {(object || isLoading) ? (
              <button
                type="button"
                onClick={isLoading ? stop : reset}
                className="btn-pill bg-white text-black border-2 border-black hover:bg-neutral-50 disabled:opacity-50"
              >
                {isLoading ? 'Stop ⏹' : 'Play Again ↺'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={!targetPreview || !attemptPreview || isLoading}
                className="btn-pill text-lg h-16 px-12 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Judging...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> COMPARE NOW
                  </span>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Results Overlay */}
        <AnimatePresence>
          {showResults && (isLoading || object) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed inset-x-4 bottom-4 md:inset-x-auto md:w-full md:max-w-2xl md:bottom-12 md:left-1/2 md:-translate-x-1/2 z-50"
            >
              <div className="card-float p-8 text-center border-4 border-white ring-4 ring-purple-100 relative overflow-hidden">
                {/* Close Button */}
                {!isLoading && (
                  <button
                    onClick={() => setShowResults(false)}
                    className="absolute top-4 right-4 z-20 text-black/50 hover:text-black hover:bg-black/5 rounded-full p-2 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}

                {/* Confetti/Decor */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-center gap-3 text-purple-600">
                    <Trophy className="w-8 h-8" />
                    <span className="font-bold tracking-widest uppercase">
                      The Verdict
                    </span>
                    <Trophy className="w-8 h-8" />
                  </div>

                  <div className="text-9xl font-serif text-black leading-none">
                    {object?.score !== undefined ? object.score : (
                      <span className="text-6xl animate-pulse">...</span>
                    )}
                    {object?.score !== undefined && <span className="text-4xl align-top opacity-40">%</span>}
                  </div>

                  <p className="text-2xl font-serif leading-relaxed text-neutral-800">
                    "{object?.feedback ?? 'AI is judging...'}"
                    {isLoading && <span className="inline-block w-2 h-6 ml-1 bg-purple-500 animate-blink align-middle" />}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 px-6 py-3 rounded-full font-bold shadow-lg z-50 border border-red-200"
            >
              🚨 {error.message || 'Connection lost. Try again!'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ImageUploadCard({
  name,
  preview,
  onChange,
  emptyLabel,
  emoji,
}: {
  name: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  emptyLabel: string;
  emoji: string;
}) {
  return (
    <label
      className={`
            relative group flex flex-col items-center justify-center w-full aspect-square md:aspect-[4/5] 
            rounded-[2.5rem] transition-all duration-300 cursor-pointer overflow-hidden
            ${preview ? 'bg-white shadow-float rotate-1' : 'bg-white/50 border-4 border-dashed border-purple-200 hover:border-purple-400 hover:bg-white/80'}
        `}
    >
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Upload"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="bg-white text-black px-6 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-lg">
              Change it ↺
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
          <span className="text-6xl select-none filter drop-shadow-sm group-hover:scale-110 transition-transform">
            {emoji}
          </span>
          <span className="font-bold text-lg text-purple-900/60 group-hover:text-purple-900">
            {emptyLabel}
          </span>
        </div>
      )}
    </label>
  );
}
