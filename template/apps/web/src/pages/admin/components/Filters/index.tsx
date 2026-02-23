import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { UsersListParams } from 'shared';
import { useDebounceValue } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const selectOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

interface FiltersProps {
  setParams: (params: Partial<UsersListParams>) => void;
}

const Filters: FC<FiltersProps> = ({ setParams }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>(selectOptions[0].value);
  const [filterDate, setFilterDate] = useState<DateRange | undefined>();

  const [debouncedSearch] = useDebounceValue(search, 500);

  const handleSort = (value: string) => {
    setSortBy(value);
    setParams({ sort: { createdOn: value === 'newest' ? 'desc' : 'asc' } });
  };

  const handleFilter = (range: DateRange | undefined) => {
    setFilterDate(range);

    if (!range?.from) {
      setParams({ filter: undefined });
      return;
    }

    if (range.to) {
      setParams({
        filter: {
          createdOn: { startDate: range.from, endDate: range.to },
        },
      });
    }
  };

  useEffect(() => {
    setParams({ searchValue: debouncedSearch });
  }, [debouncedSearch, setParams]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <div className="relative w-full sm:w-[350px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="pl-9 pr-9"
          />

          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSearch('')}
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal sm:w-[280px]',
                  !filterDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {filterDate?.from ? (
                    filterDate.to ? (
                      <>
                        {format(filterDate.from, 'LLL dd, y')} - {format(filterDate.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(filterDate.from, 'LLL dd, y')
                    )
                  ) : (
                    'Pick a date range'
                  )}
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" selected={filterDate} onSelect={handleFilter} numberOfMonths={1} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Filters;
