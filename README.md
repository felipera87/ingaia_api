# ingaia_api
API de músicas baseado na temperatura atual de uma cidade
(este programa é apenas um teste de processo seletivo)

A API está disponível em https://ingaiatest.herokuapp.com/

Arquitetura: Utilizei como linguagem o Node por ter uma grande disponibilidade em diversas plataformas e muitos recursos que podem ser agregados facilmente no projeto. O projeto possui como dependências principais o express, consign e bodyParser, que agiliza bastante o processo de desenvolvimento. Outros recursos foram utilizados para dar suporte como o cors, cookie-parser, request e querystring.

Desenvolvimento: Considerei que a API será aberta para o público, então não possui controle de acesso de usuário. Também não vi necessidade de armazenar nenhuma informação no banco de dados, já que o projeto não possui nenhum requisito que exija persistência de informação. Como a proposta é ser escalável, é interessante utilizar apenas os recursos necessários para otimizar custos. Foi feito o deploy no heroku que permite a escalabilidade do projeto criando mais dynos, mas como é apenas um teste a API possui apenas um para ficar no free tier. Desenvolvi também uma página simples para testar a API de forma mais amigável ao usuário, no entanto ela responde como uma API RESTful, devolvendo status 500 quando ocorre erro no servidor e status 400 para erro do cliente.

Particularidades: A regra de temperatura foi feita em hardcode na API por ser muito simples, mas torná-la parametrizável é uma tarefa simples já que o spotify disponibiliza uma lista com todos os gêneros musicais possíveis. O sistema de autenticação do spotify foi retirado diretamente do quickstart para ganhar tempo de desenvolvimento, realizando apenas pequenas modificações para funcionar no novo projeto. Foi utilizado um sistema de criptografia para o link de autenticação para evitar abuso por parte dos usuários, mas acredito que um dashboard de administração seria o mais adequado. Já o OpenWeatherMap tem um sistema mais simples de verificação de autenticidade então não precisou de nenhuma adaptação.
