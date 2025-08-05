# UniFy Frontend

Este repositório contém o **frontend do projeto UniFy**, desenvolvido em Angular (versão 19) como parte de um projeto acadêmico. O objetivo é oferecer uma interface web para interação com o backend [Unify](https://github.com/gaelcoder/unify-new), viabilizando o consumo e gerenciamento de dados via uma API REST.

## Sobre o Projeto

- **Frontend:** Angular 19 e Angular Material, para uma experiência moderna e responsiva.
- **Backend:** [Unify](https://github.com/gaelcoder/unify-new), em Java e Springboot.
- **Integração:** Comunicação entre frontend e backend realizada por meio de HTTP REST APIs.

Este projeto foi desenvolvido para fins de aprendizado, com foco em práticas modernas de desenvolvimento web e integração com APIs REST.

---

## Funcionalidades

- Autenticação de usuários
- Listagem, visualização e edição de registros
- Interface responsiva utilizando Angular Material
- Comunicação em tempo real com o backend Unify

---

## Estrutura do Projeto

/ ├── src/ │ ├── app/ # Código Angular principal │ ├── assets/ # Recursos estáticos │ └── environments/ # Configurações de ambiente ├── README.md ├── package.json └── angular.json

---

## Como rodar localmente

1. **Pré-requisitos**
  - Java
  - npm (gerenciador de pacotes)
  - Angular CLI

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o endpoint da API:**
  - Edite `src/environments/environment.ts` para garantir que o campo da URL da API aponte para a instância do backend [Unify](https://github.com/gaelcoder/unify-new).

4. **Inicie o servidor local:**
   ```bash
   ng serve
   ```
  - Acesse em seu navegador: [http://localhost:4200](http://localhost:4200)

---

## Integração com o Unify (Backend)

A integração com o backend [Unify](https://github.com/gaelcoder/unify-new) ocorre por meio de chamadas HTTP centralizadas nos serviços Angular. Certifique-se de que o backend esteja rodando e com os endpoints configurados corretamente para o ambiente desejado.

---

## Observações

Este projeto foi desenvolvido para fins acadêmicos.

---
