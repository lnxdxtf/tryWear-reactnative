# Projeto: TryWear - Prova Virtual de Roupas com IA e Máscara Manual

## Equipe:
Gabriel Ramos Michaliszen

---

## Descrição:
O TryWear é um protótipo de uma aplicação que simula a prova virtual de roupas utilizando inteligência artificial. A plataforma permite ao usuário carregar uma imagem própria, desenhar uma máscara sobre a região onde deseja trocar a roupa e aplicar uma nova peça utilizando um pipeline de geração de imagem via IA.

A geração da imagem é feita utilizando o **ComfyUI**, rodando localmente para fins de prototipação, com modelos como **Stable Diffusion 1.5**, **IPAdapter**, entre outros. A ideia é futuramente migrar para uma instância em nuvem com **GPU de pelo menos 8GB VRAM** utilizando o **ComfyUI-CLI**, permitindo escalabilidade e automação da geração.

## Justificativa:
No mercado de moda digital e e-commerce, a visualização personalizada de roupas é um diferencial competitivo. Reduz devoluções, aumenta a confiança na compra e melhora a experiência do usuário.

O TryWear propõe uma solução prática e automatizável, onde a geração de visualizações realistas é feita de forma flexível com IA, aproveitando a modularidade do ComfyUI.

## Objetivo:
Criar um protótipo funcional e escalável que:

- Permita ao usuário selecionar ou capturar uma imagem.
- Desenhar manualmente uma máscara sobre a área da roupa.
- Escolher uma peça de roupa para aplicar.
- Salvar a imagem original e a máscara em um bucket S3.
- Utilizar IA (via ComfyUI + IPAdapter) para gerar a imagem final.
- Visualizar o resultado da aplicação da roupa com realismo.

## Tecnologias Utilizadas:
- **React Native (Expo)**
- **Zustand** para gerenciamento de estado
- **react-native-skia** para pintura da máscara em tempo real
- **AWS S3** para armazenamento das imagens (input e máscara)
- **ComfyUI** para pipeline de geração
  - Modelos: Stable Diffusion 1.5, IPAdapter, LoRAs customizados
  - Execução atual local para protótipo
  - Futuramente: rodar o `comfyui-cli` em instâncias cloud com GPU (>8GB VRAM)
- **Node IPAdapter** (ComfyUI) para controle de condicionamento da imagem original com base na máscara
- **Fetch API** para upload direto das imagens no protótipo

## Considerações sobre Armazenamento e Backend:
Por se tratar de um **protótipo**, o upload das imagens foi feito **diretamente para o S3 a partir do app**, utilizando **Signed URLs geradas localmente**. Isso evita a necessidade de um backend neste momento inicial, acelerando o desenvolvimento e focando nos testes da IA generativa.

No entanto, é importante destacar que em um ambiente de produção:
- O uso de um **backend e banco de dados** será essencial.
- Eles servirão para **controlar o uso das instâncias de GPU**, **limitar abusos**, **autenticar usuários** e **gerenciar histórico de geração**.
- A emissão de Signed URLs e controle de permissões deve ser feita de forma segura no servidor, e **não diretamente no app**.

## Fluxo do Sistema:
1️⃣ - Usuário escolhe ou tira uma foto (imagem original).  
2️⃣ - Desenha uma máscara com o dedo sobre a área da roupa.  
3️⃣ - Escolhe uma peça de roupa (ou imagem de referência).  
4️⃣ - Imagem original e máscara são salvas no AWS S3.  
5️⃣ - O sistema (ComfyUI) gera a nova imagem com a roupa aplicada, usando IA.  
6️⃣ - A imagem final é retornada e exibida ao usuário.

## Requisitos Funcionais:
- Interface de upload e pintura de máscara.
- Seleção de peças de roupa.
- Exportação de máscara com resolução igual à imagem original.
- Upload de imagens (base64 ou arquivos) direto no S3 via Signed URL.
- Integração com pipeline ComfyUI local (futuramente cloud).
- Visualização do resultado gerado.

## Próximos Passos:
🔹 Implementar interface para visualização da imagem gerada.  
🔹 Migrar a execução do ComfyUI local para instância em nuvem com GPU.  
🔹 Suporte a múltiplas peças de roupa e customização.  
🔹 Automatizar pipeline com `comfyui-cli`.  
🔹 Implementar backend e banco de dados para controle de uso e autenticação.  
🔹 Publicação de protótipo para coleta de feedback de usuários.

## Observações:
Este projeto está em fase de prova de conceito, com foco no aprendizado e desenvolvimento de soluções práticas com IA generativa voltadas para o setor de moda e comércio eletrônico.
