import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  meal: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onSkip: () => Promise<void>;
};

export default function MealReviewCard({
  meal,
  onSubmit,
  onSkip,
}: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (rating === 0) return;

    setLoading(true);

    await onSubmit(rating, comment);

    setLoading(false);
  }

  async function skip() {
    setLoading(true);

    await onSkip();

    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <h3 className="font-semibold">
        How was today's {meal}?
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Your feedback is shared privately with the mess.
      </p>

      <div className="mt-4 flex gap-2">
        {[1,2,3,4,5].map((star)=>(
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl transition ${
              rating >= star
                ? "opacity-100"
                : "opacity-30"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <Textarea
        className="mt-4"
        placeholder="Anything you'd like to tell the mess? (optional)"
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
      />

      <div className="mt-4 flex gap-2">
        <Button
          onClick={submit}
          disabled={rating === 0 || loading}
        >
          Submit
        </Button>

        <Button
          variant="outline"
          onClick={skip}
          disabled={loading}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}