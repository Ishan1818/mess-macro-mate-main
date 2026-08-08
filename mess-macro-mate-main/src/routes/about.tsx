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
          Mess Macro Mate is a simple meal planning tool designed for students
          living in hostels. It combines your personal nutrition goals with the
          daily mess menu to recommend balanced meal choices that better match
          your calorie and protein requirements.
        </p>

        <p className="mt-3 text-muted-foreground">
          Alongside meal planning, the app allows students to privately share
          feedback about meals, helping the mess team understand student
          satisfaction and continuously improve the dining experience.
        </p>
      </div>

      <Section title="How It Works">
        <div>
          <h3 className="font-medium text-foreground">
            1. Create your profile
          </h3>

          <p>
            Enter your age, height, weight, activity level and fitness goal.
            Your daily nutrition targets are calculated automatically.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            2. View today's menu
          </h3>

          <p>
            The planner loads the menu available in the hostel mess for the
            current day.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            3. Generate your meal plan
          </h3>

          <p>
            Based on your nutrition targets and today's menu, the planner
            recommends what to eat for breakfast, lunch and dinner.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            4. Customize your meals
          </h3>

          <p>
            Swap recommended foods with other available options to better match
            your preferences.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            5. Share your feedback
          </h3>

          <p>
            After each meal period ends, you can privately rate your experience
            and optionally leave feedback for the mess management.
          </p>
        </div>
      </Section>

      <Section title="Frequently Asked Questions">
        <div>
          <h3 className="font-medium text-foreground">
            Is this a diet plan?
          </h3>

          <p>
            No. It is simply a recommendation based on the food available in
            the hostel mess.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            Do I have to follow it exactly?
          </h3>

          <p>
            No. The recommendations are flexible and can be adjusted using the
            swap feature.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            How are my nutrition targets calculated?
          </h3>

          <p>
            Daily calorie and protein targets are estimated using the
            Mifflin–St Jeor equation together with your activity level and
            selected fitness goal.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            Who can see my meal reviews?
          </h3>

          <p>
            Meal reviews are private and intended only for the mess management.
            They are never displayed publicly to other students.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            Can I skip reviews?
          </h3>

          <p>
            Yes. Reviews are completely optional and can be skipped at any time.
          </p>
        </div>
      </Section>

      <Section title="Privacy">
        <p>
          Your profile information is used only to personalize your meal
          recommendations.
        </p>

        <p>
          Meal reviews are linked to your account only to prevent duplicate
          submissions and are intended solely to help improve the mess service.
          They are not publicly visible to other students.
        </p>

        <p>
          Nutrition recommendations are estimates based on the available
          nutritional information for each food item and should be used as
          general guidance rather than medical advice.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Have a suggestion or found a bug?
        </p>

        <p>
          Please contact the hostel mess management or reach out to the project
          maintainer.
        </p>
      </Section>

      <Section title="Credits">
        <p>
          Mess Macro Mate was created to help students make smarter food choices
          while providing the mess with simple, private feedback to improve the
          dining experience.
        </p>

        <div className="rounded-lg border border-border bg-secondary/40 p-4">
          <p className="font-medium text-foreground">
            Mess Macro Mate v1.0
          </p>

          <p className="mt-1">
            Designed for students. Built to improve the hostel dining
            experience.
          </p>

          <p className="mt-3 font-medium text-foreground">
            Developed by Ishan Dhawan
          </p>
        </div>
      </Section>
    </div>
  );
}