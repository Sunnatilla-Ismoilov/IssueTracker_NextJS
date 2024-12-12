"use client";

import { Skeleton } from "@/app/components";
import { Issue } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "next-auth";
import toast, { Toaster } from "react-hot-toast";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

  if (isLoading) return <Skeleton />;

  if (error) return null;

  return (
    <div>
      <Select.Root
        defaultValue={issue.assignedToUserId || ""} // Set default value
        onValueChange={(userId) => {
          axios
            .patch(`/api/issues/${issue.id}`, {
              assignedToUserId: userId === "unassigned" ? null : userId,
              // Handle "unassigned" explicitly
            })
            .then(() => {
              toast.success("Assignee updated successfully");
            })
            .catch(() => {
              toast.error("Failed to update assignee");
            });
        }}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="unassigned">Unassigned</Select.Item>{" "}
            {/* Updated value */}
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </div>
  );
};

export default AssigneeSelect;
