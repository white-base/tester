import {useCallback, useMemo, useState} from 'react';

const seededContacts = [
  {
    id: 'c1',
    name: 'Alice Kim',
    phone: '010-2123-9999',
    email: 'alice@example.com',
    company: 'Blueway Co.',
  },
  {
    id: 'c2',
    name: 'Brian Lee',
    phone: '010-4567-1234',
    email: 'brian@contoso.dev',
    company: 'Contoso Labs',
  },
  {
    id: 'c3',
    name: 'Chloe Park',
    phone: '010-7777-8888',
    email: 'chloe@startup.kr',
    company: 'Startup KR',
  },
];

const makeId = () => `c-${Math.random().toString(36).slice(2, 9)}`;

export function useContacts() {
  const [contacts, setContacts] = useState(seededContacts);
  const [selectedId, setSelectedId] = useState(null);

  const createContact = useCallback((payload) => {
    setContacts((prev) => [
      {id: makeId(), ...payload},
      ...prev,
    ]);
  }, []);

  const updateContact = useCallback((id, payload) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? {...contact, ...payload} : contact,
      ),
    );
  }, []);

  const deleteContact = useCallback(
    (id) => {
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
    },
    [],
  );

  const selectForEditing = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const stats = useMemo(
    () => ({
      total: contacts.length,
      companies: new Set(contacts.map((contact) => contact.company)).size,
    }),
    [contacts],
  );

  return {
    contacts,
    selectedId,
    stats,
    createContact,
    updateContact,
    deleteContact,
    selectForEditing,
    clearSelection,
  };
}
