"use client";

import { useEffect, useState } from "react";
import { PersonForm } from "@/components/PersonForm";
import { peopleApi } from "@/lib/api";
import { Person } from "@/lib/types";
import { useParams } from "next/navigation";
export default function EditPersonPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const data = await peopleApi.getById(id);
        setPerson(data);
      } catch (error) {
        console.error("Error fetching person:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!person) return <div>Person not found</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Edit Person</h1>
      <PersonForm initialData={person} />
    </div>
  );
}
