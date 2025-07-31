import TurnstileWidget from "@/components/TurnstileWidget";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold pt-16! text-center">Welcome to the Recaptcha Example</h1>
      {/* <FormWithRecaptcha /> */}
      <TurnstileWidget />
    </div>
  );
}
