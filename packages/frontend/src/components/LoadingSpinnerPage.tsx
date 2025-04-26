import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function LoadingSpinnerPage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ type: "tween" }}
        role="status"
      >
        <div className="h-screen">
          <div className="flex justify-center items-center h-5/6">
            <div className="flex flex-col gap-y-4">
              <LoadingSpinner />
              <h2 className="font-black text-2xl">ZarSad</h2>
              <span className="sr-only">در حال بارگذاری</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
