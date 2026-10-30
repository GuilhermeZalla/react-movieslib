# Créditos e licenças

## Fontes vigentes — Pulso, escolha B

- [Bricolage Grotesque](https://fontsource.org/fonts/bricolage-grotesque/about): títulos. Pacote @fontsource-variable/bricolage-grotesque 5.3.0, SIL Open Font License 1.1.
- [Figtree](https://fontsource.org/fonts/figtree/about): corpo e números. Pacote @fontsource-variable/figtree 5.3.0, SIL Open Font License 1.1.

WOFF2 locais via Fontsource, font-display: swap e fallback do sistema. Licenças integrais distribuídas em [Bricolage Grotesque](public/licenses/bricolage-grotesque.txt) e [Figtree](public/licenses/figtree.txt), copiadas sem alteração do LICENSE de cada pacote. Não há requisição de fonte a CDN. Source Serif 4, Source Sans 3, PT Sans e Source Sans Pro não fazem mais parte do app/bundle; os previews históricos foram removidos na limpeza da documentação.

## Imagens e ícones

Dados/imagens reais vêm do TMDB pelo proxy. SVGs de placeholders, ilustrações, ícones e pôster fictício dos testes foram criados neste projeto; nenhum pôster TMDB está incluído nas fixtures. React Icons e o reset Meyer legado deixaram de ser usados.

## TMDB — pendência antes de publicar

Obter um logo aprovado em [Logos e atribuição](https://www.themoviedb.org/about/logos-attribution), preservar cores/proporções e integrá-lo à seção Créditos, menor que a marca principal. **O arquivo não está instalado.** O rodapé atual usa texto e não tenta carregar um arquivo ausente; o texto não substitui o logo obrigatório. Integração será feita na etapa de pré-publicação.

Aviso exato conforme a [FAQ oficial](https://developer.themoviedb.org/docs/faq):

> This product uses the TMDB API but is not endorsed or certified by TMDB.

O projeto mantém a licença MIT existente. Bibliotecas conservam suas licenças próprias. Ferramentas de auditoria são apenas de desenvolvimento; Lighthouse usa Apache-2.0 e axe-core usa MPL-2.0, com avisos nos respectivos pacotes.

## Demonstrações e marca MoviesLib

As capturas em docs/screenshots e os GIFs em docs/demo foram atualizados em **30/10/2026**, a partir do site funcionando com dados, pôsteres e fotos reais fornecidos pelo TMDB. Não usam substituições de conteúdo nem as artes fictícias de scripts/demo/showcase.mjs. O catálogo pode mudar depois da gravação.

Pôsteres, backdrops, fotos de pessoas e demais materiais de terceiros continuam pertencendo aos respectivos titulares; sua presença nas capturas não os torna parte da licença MIT do código. O uso e a atribuição do TMDB e as pendências de conferência dos termos continuam registrados no STATUS. Não há pacote de imagens TMDB separado nestes documentos: as mídias mostram as telas completas da aplicação. Fontes conservam suas licenças OFL; a marca/favicon e as ilustrações próprias permanecem sob a licença do projeto.

O script de captura usa perfis descartáveis e o proxy já configurado do aplicativo, sem ler o token ou o perfil do proprietário. Instruções de regeneração em [Configuração e operação](docs/OPERACAO.md#atualizar-fotos-e-gifs). Não há mudança da identidade do site ou dos ícones nesta entrega.
