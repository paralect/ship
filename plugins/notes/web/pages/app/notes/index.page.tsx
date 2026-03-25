import Head from 'next/head';
import { useState } from 'react';

import { LayoutType, Page, ScopeType } from 'components';
import { useApiQuery, useApiMutation, useQueryClient, queryKey } from 'hooks';
import { apiClient } from 'services/api-client.service';

const NotesPage = () => {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useApiQuery(apiClient.notes.list);

  const createMutation = useApiMutation(apiClient.notes.create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(apiClient.notes.list) });
      setText('');
    },
  });

  const removeMutation = useApiMutation(apiClient.notes.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(apiClient.notes.list) });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    createMutation.mutate({ text: text.trim() });
  };

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      <Head>
        <title>Notes</title>
      </Head>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Notes</h1>

        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={createMutation.isPending || !text.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Adding...' : 'Add'}
          </button>
        </form>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-muted-foreground">No notes yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex items-center justify-between rounded-md border border-border bg-card p-3"
              >
                <span className="text-sm text-card-foreground">{note.text}</span>
                <button
                  onClick={() => removeMutation.mutate({ id: note.id })}
                  disabled={removeMutation.isPending}
                  className="ml-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  );
};

export default NotesPage;
