CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Conversa',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX conversations_user_idx ON public.conversations(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conversations" ON public.conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','model')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_conversation_idx ON public.messages(conversation_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.integration_status (
  user_id uuid NOT NULL,
  provider text NOT NULL,
  status text NOT NULL DEFAULT 'unknown',
  auth_type text NOT NULL,
  last_checked_at timestamptz,
  last_used_at timestamptz,
  last_error text,
  PRIMARY KEY (user_id, provider)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integration_status TO authenticated;
GRANT ALL ON public.integration_status TO service_role;
ALTER TABLE public.integration_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own status" ON public.integration_status FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.github_selection (
  user_id uuid PRIMARY KEY,
  repo_full_name text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.github_selection TO authenticated;
GRANT ALL ON public.github_selection TO service_role;
ALTER TABLE public.github_selection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own selection" ON public.github_selection FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.app_user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  connector_id text NOT NULL,
  connection_key_ciphertext text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, connector_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_user_connections TO service_role;
ALTER TABLE public.app_user_connections ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.inspect_schema()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_catalog AS $$
DECLARE result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT jsonb_build_object(
    'database', current_database(),
    'version', version(),
    'tables', COALESCE(jsonb_agg(t ORDER BY t->>'name'), '[]'::jsonb)
  ) INTO result FROM (
    SELECT jsonb_build_object(
      'name', c.relname,
      'comment', obj_description(c.oid),
      'rls_enabled', c.relrowsecurity,
      'estimated_rows', c.reltuples::bigint,
      'columns', (SELECT jsonb_agg(jsonb_build_object('name', a.attname, 'type', format_type(a.atttypid, a.atttypmod), 'nullable', NOT a.attnotnull, 'default', pg_get_expr(d.adbin, d.adrelid)) ORDER BY a.attnum)
         FROM pg_attribute a LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum
         WHERE a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped),
      'constraints', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', con.conname, 'type', con.contype, 'definition', pg_get_constraintdef(con.oid))), '[]') FROM pg_constraint con WHERE con.conrelid=c.oid),
      'indexes', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', i.indexname, 'definition', i.indexdef)), '[]') FROM pg_indexes i WHERE i.schemaname='public' AND i.tablename=c.relname),
      'policies', (SELECT COALESCE(jsonb_agg(jsonb_build_object('name', p.policyname, 'command', p.cmd, 'roles', p.roles, 'using', p.qual, 'check', p.with_check)), '[]') FROM pg_policies p WHERE p.schemaname='public' AND p.tablename=c.relname)
    ) AS t
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='r'
  ) s;
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.inspect_schema() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.inspect_schema() TO authenticated;

COMMENT ON TABLE public.conversations IS 'Conversa do chat de cada usuário';
COMMENT ON TABLE public.messages IS 'Mensagens trocadas entre usuário e Gemini';
COMMENT ON TABLE public.integration_status IS 'Estado e último teste de cada integração (sem segredos)';
COMMENT ON TABLE public.github_selection IS 'Repositório GitHub selecionado pelo usuário';
COMMENT ON TABLE public.app_user_connections IS 'Chaves de conexão por usuário, criptografadas, acesso só do servidor';