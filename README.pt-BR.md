# Idiomas

[English](README.md) · **Português** · [Español](README.es.md)

Um espaço de estudo de idiomas construído para uso real, não para coleção de exercícios. Hoje ele cobre **inglês** e **espanhol**, e cada idioma é dividido em duas frentes: o **estudo do dia a dia** e a **preparação para provas**.

[Abrir a aplicação](https://sat-simulado.vercel.app)

![Painel de estudo](english-desktop.png)

---

## Por que ele existe

Aplicativo de idioma costuma falhar de dois jeitos: vira uma lista infinita de exercícios sem rumo, ou vira um simulado que só mede e não ensina. Aqui as duas coisas convivem sem se atrapalhar — o plano diário fica separado das trilhas de prova, e o progresso é sempre do usuário, guardado primeiro no próprio dispositivo.

## Inglês

**Estudo** — plano diário ajustável (nível, minutos por sessão, dias por semana), cursos gratuitos com acompanhamento de andamento, prática de leitura e vocabulário, conversação com contexto pronto para um tutor de IA, e repetição espaçada para revisar no intervalo certo.

**Provas** — trilhas dedicadas de **SAT**, **ACT** e **TOEFL**, mais um simulado no formato do SAT digital: Reading & Writing e Math, com o segundo módulo se adaptando ao desempenho no primeiro, cronômetro, navegação entre questões, eliminação de alternativas, marcação para revisão e folha de fórmulas.

O inglês ainda escolhe entre variedade **britânica** e **americana**, e isso muda vocabulário, pronúncia e exemplos — não é só um rótulo.

## Espanhol

**Estudo** — plano diário no mesmo formato, oito recursos gratuitos selecionados e conferidos um a um (Language Transfer, Dreaming Spanish, três do Instituto Cervantes, UT Austin, SpanishDict e Conjuguemos), frases por nível com áudio, e conversação com um contexto que instrui o tutor a corrigir **portunhol** especificamente.

**Provas** — simulado autoral com questões de interpretação de texto, vocabulário em contexto, gramática em uso e **falsos amigos** — que é onde quem fala português mais erra. Cada questão explica a resposta em português, e o histórico de tentativas fica salvo.

A variedade pode ser **Espanha** ou **América Latina**, alterando pronúncia e vocabulário.

## Decisões técnicas que valem menção

- **Local primeiro.** Todo o progresso vive no IndexedDB do dispositivo e funciona sem conta. A sincronização com a nuvem é opcional e usa a mesma sessão autenticada do ARTX Hub — não existe segunda senha.
- **Sincronização com detecção de conflito.** A escrita usa comparação de revisão, então duas abas ou dois aparelhos não sobrescrevem um ao outro em silêncio.
- **Um registro, dois idiomas.** Inglês e espanhol dividem o mesmo registro sincronizado, com testes garantindo que salvar um nunca apague o outro.
- **Credencial de IA nunca chega ao navegador.** A geração de conteúdo passa por um endpoint no servidor; a chave do provedor fica só lá.
- **Isolamento por conta.** Cada conta aprovada abre seu próprio banco local, com o identificador validado antes de virar nome de banco.

## Tecnologias

React 19, TypeScript, Vite, Tailwind CSS, Zustand, Dexie/IndexedDB, Supabase, Vitest, Recharts e KaTeX.

## Desenvolvimento local

```powershell
npm.cmd install
npm.cmd run dev
```

Configuração opcional:

| Variável | Para que serve |
| --- | --- |
| `LLM_BASE_URL` | Endpoint compatível com OpenAI, usado no servidor |
| `LLM_MODEL` | Identificador do modelo |
| `LLM_API_KEY` | Credencial do provedor — nunca exposta ao navegador |
| `VITE_SUPABASE_URL` | URL do projeto Supabase (opcional) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública para a sincronização autenticada |

Copie `.env.example` para `.env.local`. Nunca versione chaves reais.

## Verificação

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
npm.cmd audit --omit=dev
```

## Mapa do repositório

```text
api/              Endpoint de geração de conteúdo
src/components/   Interface compartilhada de estudo e prova
src/data/         Conteúdo e bancos de questões (inglês e espanhol)
src/lib/          Armazenamento, sincronização, correção e motores de estudo
src/pages/        Telas de estudo, prova e progresso
src/store/        Estado do usuário e da prova em andamento
tests/            Testes de armazenamento, estudo e regressão
```

## Aviso acadêmico

Projeto educacional independente, sem vínculo com College Board, ACT, ETS ou Instituto Cervantes. A pontuação dos simulados é uma aproximação para prática e não deve ser apresentada como nota oficial. O simulado de espanhol é autoral e ainda não se ancora em nenhuma prova oficial específica.

## Situação

Em uso ativo. O modo local funciona sem conta; sincronização entre dispositivos e geração de exercícios dependem dos serviços opcionais estarem configurados.

Feito e mantido por [Kauã Diniz Souza](https://github.com/Kauadsouza).
