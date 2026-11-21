COMMENT ON TABLE public.conversations IS 'Conversa do chat de cada usuário';
COMMENT ON TABLE public.messages IS 'Mensagens trocadas entre usuário e Gemini';
COMMENT ON TABLE public.integration_status IS 'Estado e último teste de cada integração (sem segredos)';
COMMENT ON TABLE public.github_selection IS 'Repositório GitHub selecionado pelo usuário';
COMMENT ON TABLE public.app_user_connections IS 'DEPRECATED: não utilizada; GitHub conecta via token de API no servidor';