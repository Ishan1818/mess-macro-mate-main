import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-soft p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">About Mess Macro Mate</h1>

        <p className="mt-3 text-muted-foreground">
          Hostel food is fixed — you can't choose what's cooked, only what
          you put on your plate. Mess Macro Mate takes your daily calorie and
          protein targets and matches them against today's actual mess menu,
          so you know what to pick before you're standing in line holding up
          everyone behind you.
        </p>

        <p className="mt-3 text-muted-foreground">
          It also gives students a private way to rate meals, so the mess
          team gets real feedback instead of guessing from leftover food.
        </p>
      </div>

      <Section title="How It Works">
        <div>
          <h3 className="font-medium text-foreground">
            1. Set up your profile
          </h3>
          <p>
            Age, height, weight, activity level and goal. Your calorie and
            protein targets are calculated using the Mifflin–St Jeor formula
            — the same one dietitians use, not a guess.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            2. Check today's menu
          </h3>
          <p>
            The planner pulls whatever's on the mess menu for today —
            nothing generic, nothing you can't actually get.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            3. Get your plan
          </h3>
          <p>
            One tap generates a breakfast, lunch and dinner combo built to
            hit your targets as closely as the menu allows.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            4. Swap what you don't want
          </h3>
          <p>
            Don't like an item the planner picked? Swap it for another
            option on today's menu without breaking your targets.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            5. Rate your meal
          </h3>
          <p>
            Once a meal window closes, leave a quick private rating. Takes
            five seconds, and it's the only feedback loop the mess actually
            gets.
          </p>
        </div>
      </Section>

      <Section title="Frequently Asked Questions">
        <div>
          <h3 className="font-medium text-foreground">Is this a diet plan?</h3>
          <p>
            No. It's a recommendation engine built around what's actually
            being served — not a prescribed diet.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            Do I have to follow it exactly?
          </h3>
          <p>
            No. Treat it as a starting point. Swap freely — the targets
            update as you do.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            How are my targets calculated?
          </h3>
          <p>
            Mifflin–St Jeor equation for BMR, adjusted for your activity
            level and goal (lose / maintain / gain).
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            What if I miss a meal or skip a day?
          </h3>
          <p>
            Nothing breaks. Each day's plan is generated fresh — there's no
            streak to lose or catch-up math to do.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            Who sees my meal reviews?
          </h3>
          <p>
            Only mess management. Reviews are never shown to other students,
            publicly or otherwise.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">Can I skip reviews?</h3>
          <p>Yes, always. Reviews are optional, every single time.</p>
        </div>
      </Section>

      <Section title="Privacy">
        <p>
          Your profile is used only to calculate and personalize your meal
          recommendations. It isn't shared, sold, or shown to anyone else.
        </p>

        <p>
          Reviews are tied to your account only to stop duplicate
          submissions, and exist solely to help the mess improve — not for
          public display.
        </p>

        <p>
          Nutrition numbers are estimates based on standard food data.
          They're guidance, not medical advice.
        </p>
      </Section>

      <Section title="Contact">
        <p>Found a bug, or have an idea to make this better?</p>
        <p>
          Reach out to the mess management directly, or ping the project
          maintainer — see the credits below.
        </p>
      </Section>

      <Section title="Credits">
        <p>
          Built to help students eat smarter on mess food, and to give the
          mess a real feedback channel instead of silence.
        </p>

        <div className="rounded-lg border border-border bg-secondary/40 p-4">
          <p className="font-medium text-foreground">Mess Macro Mate v1.0</p>
          <p className="mt-1">
            Built for hostel students, by a hostel student.
          </p>
          <p className="mt-3 font-medium text-foreground">
            Developed by{" "}
            <a
              href="https://github.com/ishan1818"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Ishan Dhawan
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}