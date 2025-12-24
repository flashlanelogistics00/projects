-- Allow authenticated users (admins) to delete contact messages
CREATE POLICY "Allow authenticated users to delete contact messages"
    ON contact_messages FOR DELETE
    TO authenticated
    USING (true);
