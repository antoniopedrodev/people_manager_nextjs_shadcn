"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { Person } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { DeleteConfirmation } from '@/components/DeleteConfirmation';
import { Pagination } from '@/components/ui/pagination';
import { peopleApi } from '@/lib/api';

const ITEMS_PER_PAGE = 5;

export default function PeopleTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [people, search]);

  const paginatedPeople = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredPeople.slice(start, end);
  }, [filteredPeople, page]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);
  }, [filteredPeople]);

  const fetchPeople = async () => {
    try {
      setIsLoading(true);
      const data = await peopleApi.getAll();
      setPeople(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const deletePeople = async (id: string) => {
    try {
      await peopleApi.delete(id);
      await fetchPeople();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 p-[12px]">
      <p className='text-2xl'>
        People Manager
      </p>
      <div className="flex justify-between">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => router.push('/people/new')}>Add Person</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPeople.length > 0 ? (
            paginatedPeople.map((person: Person) => (
              <TableRow key={person.id}>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell>{new Date(person.dateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell>{person.cpf}</TableCell>
                <TableCell>{person.telephone}</TableCell>
                <TableCell>{person.address}</TableCell>
                <TableCell>{person.city}</TableCell>
                <TableCell>{person.state}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/people/${person.id}/edit`)}
                  >
                    <Pencil />
                  </Button>
                  <DeleteConfirmation
                    onConfirm={() => deletePeople(person.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {filteredPeople.length > ITEMS_PER_PAGE && (
        <Pagination>
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft /> Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next <ChevronRight />
            </Button>
          </div>
        </Pagination>
      )}
    </div>
  );
}
