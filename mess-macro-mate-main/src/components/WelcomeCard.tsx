import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function WelcomeCard() {
  return (
    <section className="card-soft mx-auto mt-10 max-w-xl p-8 text-center">
      <h1 className="text-2xl font-bold">
        Welcome to Mess Macro Planner
      </h1>

      <p className="mt-2 text-muted-foreground">
        Tell us your body stats and goal once.
        We'll do the math on every mess meal after that.
      </p>

      <Button
        asChild
        size="lg"
        className="mt-6"
      >
        <Link to="/profile">
          Set up my profile
        </Link>
      </Button>
    </section>
  );
}