import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/auth/AuthProvider";
import MealReviewCard from "./MealReviewCard";

import {
  getMealReview,
  submitMealReview,
  skipMealReview,
} from "@/lib/api/reviews";

import { shouldShowReview } from "@/lib/review";
import type { MealName } from "@/lib/mess-types";

type Props = {
  meal: MealName;
};

export default function MealReviewSection({
  meal,
}: Props) {
  const { session } = useAuthContext();
  const queryClient = useQueryClient();

  const [completed, setCompleted] = useState(false);
  const [hideMessage, setHideMessage] = useState(false);

  const { data: review } = useQuery({
    queryKey: ["meal-review", meal],
    enabled: !!session && shouldShowReview(meal),
    queryFn: () =>
      getMealReview(session!.user.id, meal),
  });

  useEffect(() => {
    if (!completed) return;

    const timer = setTimeout(() => {
      setHideMessage(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [completed]);

  const submitMutation = useMutation({
    mutationFn: ({
      rating,
      comment,
    }: {
      rating: number;
      comment: string;
    }) =>
      submitMealReview(
        session!.user.id,
        meal,
        rating,
        comment,
      ),

    onSuccess: () => {
      setCompleted(true);

      queryClient.invalidateQueries({
        queryKey: ["meal-review", meal],
      });
    },
  });

  const skipMutation = useMutation({
    mutationFn: () =>
      skipMealReview(
        session!.user.id,
        meal,
      ),

    onSuccess: () => {
      setCompleted(true);

      queryClient.invalidateQueries({
        queryKey: ["meal-review", meal],
      });
    },
  });

  if (!shouldShowReview(meal)) return null;

  if ((review || completed) && !hideMessage) {
    return (
      <div className="mt-4 animate-in fade-in duration-300 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
        <p className="font-medium text-green-700 dark:text-green-400">
          ✓ Feedback submitted
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Thanks for helping improve today's {meal}.
        </p>
      </div>
    );
  }

  if (hideMessage) return null;

  return (
    <div className="mt-4 animate-in fade-in duration-300">
      <MealReviewCard
        meal={meal}
        onSubmit={(rating, comment) =>
          submitMutation.mutateAsync({
            rating,
            comment,
          })
        }
        onSkip={() =>
          skipMutation.mutateAsync()
        }
      />
    </div>
  );
}