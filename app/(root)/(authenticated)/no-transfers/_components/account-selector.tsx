"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountSelectorProps {
  accounts: { fpl_team_id: number; player_name: string | null }[];
  selectedTeamId: number;
}

export function AccountSelector({
  accounts,
  selectedTeamId,
}: AccountSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (accounts.length <= 1) return null;

  return (
    <Select
      value={String(selectedTeamId)}
      onValueChange={(value) => router.replace(`${pathname}?team=${value}`)}
    >
      <SelectTrigger className="w-[220px] text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((a) => (
          <SelectItem key={a.fpl_team_id} value={String(a.fpl_team_id)}>
            {a.player_name ?? `Team ${a.fpl_team_id}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
