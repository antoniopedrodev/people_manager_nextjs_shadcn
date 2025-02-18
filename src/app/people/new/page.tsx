import { PersonForm } from "@/components/PersonForm";

export default function NewPersonPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Create New Person</h1>
      <PersonForm />
    </div>
  );
}