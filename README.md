# Cat Breeds Catalog  (=^･ω･^=)

Catálogo de raças de gatos feito em React Native + Expo (TypeScript), como Projeto Somativo da disciplina **Desenvolvimento Mobile Híbrido** — *Catálogo Interativo 2.0*.

**Vídeo de apresentação:** _link do YouTube aqui_

**Integrantes:**
- Ayla Micheluzzi
- Gabriel Baczinski

---

## Sobre o app

O usuário cria uma conta, faz login e navega por um catálogo com todas as raças de gatos da The Cat API. A partir dele é possível:

- rolar a lista em grade, que carrega novas páginas da API conforme o usuário desce;
- buscar raças pelo nome e filtrar os resultados por tipo de pelagem;
- abrir os detalhes de uma raça: foto, origem, personalidade, peso, altura, expectativa de vida, descrição, história e uma galeria com mais fotos;
- favoritar raças;
- marcar raças como *Kitties I've met* (os "itens consumidos" do enunciado) e dar uma nota de 1 a 5 patinhas;
- ver o perfil com os contadores de favoritos e gatinhos conhecidos, e sair da conta.

Favoritos, gatinhos conhecidos e a sessão continuam salvos depois de fechar o app. Favoritos e gatinhos conhecidos também ficam na nuvem (Supabase), então voltam mesmo depois de reinstalar o app e entrar com o mesmo e-mail.

## Configuração

| Item | Escolha |
|---|---|
| API | [The Cat API](https://thecatapi.com) — `https://api.thecatapi.com/v1` |
| Persistência | Local (AsyncStorage, separada por usuário) **e nuvem** ([Supabase](https://supabase.com)), com sincronização — bônus do RF06 |
| Login | Local, com expo-secure-store e senha guardada como hash SHA-256 com salt (expo-crypto) |
| Idioma da interface | Inglês, porque a API e a busca só funcionam em inglês |

## Como rodar

Pré-requisitos: Node.js 20 ou superior e o app **Expo Go** no celular (ou um emulador Android/iOS).

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o arquivo de ambiente a partir do exemplo:
   ```bash
   cp .env.example .env
   ```
3. Gere uma chave gratuita em <https://thecatapi.com> e cole no `.env`:
   ```
   EXPO_PUBLIC_CAT_API_KEY=sua_chave_aqui
   ```
4. Nuvem (opcional): crie um projeto grátis em <https://supabase.com>, abra **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**. Depois copie a **Project URL** e a **Publishable key** (Project Settings → API Keys) para o `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_...
   ```
   Sem essas duas variáveis o app funciona normalmente, salvando só no aparelho.
5. Inicie o projeto:
   ```bash
   npx expo start
   ```
6. Leia o QR Code com o Expo Go (Android) ou com a câmera (iOS).

Observações:
- O `.env` está no `.gitignore`, então as chaves nunca vão para o repositório. Sem a chave da The Cat API, a API responde 403 e o app mostra uma mensagem de erro.
- Use a **Publishable key** do Supabase, nunca a Secret key: tudo que tem `EXPO_PUBLIC_` vai junto dentro do app.
- Como o login é local (sem Supabase Auth), os dados da nuvem são identificados pelo e-mail e as políticas do banco liberam leitura e escrita para a chave pública. É suficiente para um projeto acadêmico, mas um app real precisaria de autenticação no Supabase.
- A tela **Profile** mostra o estado da nuvem: sincronizado, sincronizando ou indisponível (nesse caso os dados continuam salvos no aparelho).
- O login usa o expo-secure-store, que só existe em Android e iOS. A versão web não é suportada.

## Requisitos funcionais

| RF | Implementação | Arquivo principal |
|---|---|---|
| RF01 — Catálogo | FlatList em grade de 2 colunas, paginação real no servidor (`limit`/`page`), pull-to-refresh e placeholder para raças sem foto | `src/screens/CatalogScreen.tsx`, `src/hooks/useBreedCatalog.ts` |
| RF02 — Navegação | Native Stack; o detalhe recebe só o `id` por `route.params` e define o título com `navigation.setOptions` | `src/navigation/AppStack.tsx` |
| RF03 — Detalhes | Segunda requisição (`/breeds/{id}`), foto grande, atributos e textos limpos por `stripHtml` | `src/screens/BreedDetailScreen.tsx` |
| RF04 — Favoritos | Context API com `useFavorites()`; o coração do detalhe e o do card usam o mesmo estado | `src/contexts/FavoritesContext.tsx` |
| RF05 — Tela de favoritos | Lista vinda do Context, com estado vazio | `src/screens/FavoritesScreen.tsx` |
| RF06 — Persistência (+ bônus nuvem) | AsyncStorage por usuário, lido em `useEffect`, com indicador de carregamento enquanto lê; cópia no Supabase sincronizada ao abrir e a cada mudança | `src/hooks/usePersistedState.ts`, `src/hooks/useSyncedList.ts`, `src/services/cloudSync.ts` |
| RF07 — Login e consumidos | Navegação condicional pelo `AuthContext`, sessão salva, logout e *Kitties I've met* com nota de 1 a 5 | `src/navigation/RootNavigator.tsx`, `src/contexts/MetContext.tsx`, `src/screens/MetScreen.tsx` |
| RF08 — Busca | Endpoint `/breeds/search` chamado pelo botão **Search** ou pelo Enter, com lista de resultados e filtro por pelagem | `src/screens/SearchScreen.tsx` |
| RF09 — Feedback de UI | `ActivityIndicator` e mensagem de erro com **Try again** em todas as requisições; `AbortController` no cleanup | `src/hooks/useFetch.ts`, `src/components/ErrorView.tsx` |
| RF10 — Acessibilidade | Labels, roles e `accessibilityState`, contraste de pelo menos 4.5:1, áreas de toque de 44×44 e sem alturas fixas em textos | `src/components/` |

## Estrutura do projeto

```
App.tsx              Providers e NavigationContainer
src/
  services/          axios, chamadas da The Cat API, Supabase, login local, mensagens de erro
  contexts/          AuthContext, FavoritesContext, MetContext
  hooks/             useFetch, useBreedCatalog, usePersistedState, useSyncedList, useAsyncAction...
  components/        componentes reutilizáveis (BreedCard, CatImage, PawRating, ErrorView...)
  screens/           Login, Register, Catalog, BreedDetail, Search, Favorites, Met, Profile
  navigation/        RootNavigator, AuthStack, AppStack e tipos das rotas
  theme/             cores e tamanho mínimo de toque
  utils/             stripHtml, coatType, toSavedBreed
  types/             tipos das respostas da API e dos dados salvos
supabase/schema.sql  script que cria as tabelas na nuvem
```

## Comandos úteis

```bash
npx expo start       # inicia o servidor de desenvolvimento
npx tsc --noEmit     # checagem de tipos
npx expo-doctor      # checagem da configuração do Expo
```
