import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function MacroGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          ⓘ Macro Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Understanding Your Macros</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div>
            <h3 className="font-medium">🔥 Calories</h3>
            <p className="text-sm text-muted-foreground">
              Calories are the total energy you get from food. Staying close to
              your daily target helps you lose, maintain, or gain weight.
            </p>
          </div>
          <div>
            <h3 className="font-medium">💪 Protein</h3>
            <p className="text-sm text-muted-foreground">
              Protein helps build and repair muscles while keeping you fuller
              for longer. Try to hit this target every day.
            </p>
          </div>
          <div>
            <h3 className="font-medium">🍚 Carbohydrates</h3>
            <p className="text-sm text-muted-foreground">
              Carbs are your body's primary source of energy. They fuel workouts
              and everyday activities.
            </p>
          </div>
          <div>
            <h3 className="font-medium">🥑 Fat</h3>
            <p className="text-sm text-muted-foreground">
              Healthy fats support hormones, brain function, and vitamin
              absorption. They're an important part of a balanced diet.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}