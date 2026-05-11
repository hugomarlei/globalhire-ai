import type { LegalSection } from "@/components/legal-page";

export const legalUpdatedAt = "11 de maio de 2026";

export const privacyIntro = [
  "Esta Política de Privacidade descreve como a GlobalHire AI trata dados pessoais no contexto da plataforma SaaS disponível em https://www.globalhireai.com.br, voltada à criação, análise e otimização de materiais profissionais com apoio de inteligência artificial.",
  "A GlobalHire AI atua, em regra, como controladora dos dados pessoais tratados para cadastro, autenticação, assinatura, suporte, segurança, analytics e entrega das funcionalidades contratadas. Determinados provedores técnicos, como Supabase, Stripe, Cloudflare, Groq, PostHog e Microsoft Clarity, podem atuar como operadores ou controladores independentes conforme a natureza do serviço prestado."
];

export const privacySections: LegalSection[] = [
  {
    title: "1. Dados pessoais tratados",
    paragraphs: [
      "Podemos tratar dados fornecidos diretamente pelo usuário, dados gerados pelo uso da plataforma e dados recebidos por provedores de autenticação, pagamento, segurança e analytics.",
      "Não solicitamos que o usuário envie dados pessoais sensíveis. Currículos podem conter informações sensíveis inseridas voluntariamente pelo próprio usuário, como dados de saúde, filiação sindical, origem racial ou étnica, religião, opinião política ou dados familiares. Recomendamos remover essas informações quando não forem necessárias para a vaga."
    ],
    bullets: [
      "Dados cadastrais: nome, e-mail, identificador de usuário, preferências de idioma, país-alvo e plano contratado.",
      "Dados de autenticação: credenciais gerenciadas pelo Supabase, dados de sessão, tokens técnicos e informações retornadas por Google OAuth quando usado pelo usuário.",
      "Dados profissionais: currículo, histórico profissional, competências, formação, descrições de vaga, cartas, mensagens profissionais, preparação de entrevista e documentos gerados.",
      "Dados de uso: páginas acessadas, ferramentas utilizadas, eventos de limite de plano, tipo de documento, idioma, país selecionado, data e hora de ações.",
      "Dados técnicos: endereço IP, user agent, identificadores de sessão, logs de erro, eventos de segurança, métricas de performance e registros antifraude.",
      "Dados de pagamento: status da assinatura, plano, Price ID, Customer ID, Subscription ID, datas de ciclo e recibos processados pelo Stripe. Dados completos de cartão não são armazenados pela GlobalHire AI."
    ]
  },
  {
    title: "2. Finalidades do tratamento",
    paragraphs: [
      "Tratamos dados pessoais para operar a plataforma, entregar as funcionalidades solicitadas, manter segurança, cumprir obrigações legais e melhorar a experiência do usuário.",
      "Os dados profissionais enviados são usados para gerar ou reformular currículos, calcular compatibilidade ATS, sugerir melhorias, preparar entrevistas, traduzir documentos e criar mensagens profissionais, sempre dentro do contexto solicitado pelo usuário."
    ],
    bullets: [
      "Criar e manter conta de usuário.",
      "Autenticar acesso por e-mail/senha ou Google OAuth.",
      "Processar assinaturas, upgrades, downgrades, cancelamentos, recibos e faturamento via Stripe.",
      "Executar solicitações de IA generativa por meio de provedores compatíveis, incluindo Groq.",
      "Salvar histórico, documentos e preferências quando a funcionalidade exigir persistência.",
      "Aplicar limites de uso por plano, prevenir abuso, fraude, automação indevida e uso não autorizado.",
      "Realizar analytics de produto com PostHog e Microsoft Clarity, quando aplicável e conforme consentimento.",
      "Responder solicitações de suporte, privacidade, cobrança e incidentes de segurança."
    ]
  },
  {
    title: "3. Bases legais da LGPD",
    paragraphs: [
      "A GlobalHire AI enquadra cada operação de tratamento nas bases legais previstas na Lei Geral de Proteção de Dados Pessoais, observando finalidade, adequação, necessidade, transparência, segurança e responsabilização.",
      "A base legal aplicável pode variar conforme a funcionalidade e o contexto de uso."
    ],
    bullets: [
      "Execução de contrato ou procedimentos preliminares: criação de conta, entrega das funcionalidades, armazenamento de documentos, suporte e gestão de assinatura.",
      "Cumprimento de obrigação legal ou regulatória: guarda de registros, obrigações fiscais, registros transacionais e atendimento a autoridades competentes.",
      "Legítimo interesse: segurança, prevenção a fraude, melhoria de produto, logs técnicos, métricas operacionais e proteção da plataforma, sempre com avaliação de proporcionalidade.",
      "Consentimento: cookies analíticos, certas ferramentas de analytics e comunicações opcionais quando exigido.",
      "Exercício regular de direitos: preservação de evidências, defesa em processos administrativos, judiciais ou arbitrais."
    ]
  },
  {
    title: "4. Google OAuth, Supabase e autenticação",
    paragraphs: [
      "Quando o usuário opta por login social com Google, a GlobalHire AI pode receber dados mínimos necessários para autenticação, como e-mail, nome associado à conta e identificador técnico. O uso do Google OAuth depende das configurações do provedor e das permissões aprovadas pelo usuário.",
      "O Supabase é utilizado para autenticação, gerenciamento de sessão e armazenamento de dados necessários à operação da conta. Tokens, sessões e credenciais são tratados por infraestrutura técnica própria do provedor e pela aplicação."
    ]
  },
  {
    title: "5. IA generativa, Groq e tratamento automatizado",
    paragraphs: [
      "A plataforma utiliza IA generativa para processar comandos do usuário e produzir textos profissionais. Para isso, conteúdos inseridos em campos de currículo, descrição de vaga e preferências podem ser enviados a provedores de IA, incluindo Groq, exclusivamente para execução da funcionalidade solicitada.",
      "A GlobalHire AI não utiliza a IA para tomar decisão final sobre contratação, aprovação, rejeição, elegibilidade profissional ou concessão de benefício ao usuário. O ATS Score e as recomendações são estimativas automatizadas de apoio, não decisões com efeito jurídico automático.",
      "O usuário deve revisar os resultados gerados antes de usá-los em processos seletivos. A plataforma não deve ser usada para inserir informações falsas, inflar qualificações inexistentes ou induzir recrutadores em erro."
    ]
  },
  {
    title: "6. Cookies, PostHog e Microsoft Clarity",
    paragraphs: [
      "Usamos cookies essenciais e tecnologias semelhantes para login, segurança, sessão, prevenção a abuso e funcionamento da plataforma. Esses cookies são necessários para a prestação do serviço.",
      "Cookies e scripts analíticos podem ser utilizados para compreender navegação, funis de uso, erros, conversões e melhoria de produto. Microsoft Clarity pode registrar mapas de calor e sessões de navegação, e PostHog pode registrar eventos de produto. Esses provedores devem ser configurados para não receber conteúdo completo de currículos, descrições de vaga, documentos, telefone, endereço ou dados sensíveis.",
      "Quando exigido, analytics só será carregado após consentimento. O usuário pode aceitar, rejeitar ou alterar preferências pelo banner ou link de preferências de cookies."
    ]
  },
  {
    title: "7. Stripe e dados de pagamento",
    paragraphs: [
      "Pagamentos, assinaturas, cartões, boletos, recibos, cobrança recorrente, cancelamentos e reembolsos são processados pelo Stripe. A GlobalHire AI recebe apenas informações necessárias para refletir o plano, status da assinatura, período de vigência, identificação do cliente e histórico operacional.",
      "A GlobalHire AI não armazena número completo de cartão, código de segurança ou dados sensíveis de instrumento de pagamento. Esses dados são processados diretamente pelo Stripe conforme seus próprios padrões de segurança e termos."
    ]
  },
  {
    title: "8. Compartilhamento com terceiros e transferência internacional",
    paragraphs: [
      "Dados pessoais podem ser compartilhados com provedores de infraestrutura, autenticação, pagamentos, segurança, analytics, IA, hospedagem, e-mail, suporte e observabilidade, sempre de forma compatível com as finalidades descritas nesta Política.",
      "Como parte desses provedores pode operar fora do Brasil, pode ocorrer transferência internacional de dados. Nesses casos, a GlobalHire AI adota provedores reconhecidos e busca utilizar medidas contratuais, técnicas e administrativas adequadas ao nível de risco, observando a LGPD."
    ],
    bullets: [
      "Supabase: autenticação, banco de dados e armazenamento.",
      "Vercel: hospedagem e execução da aplicação.",
      "Stripe: pagamentos, assinaturas e portal de cobrança.",
      "Google: autenticação social OAuth quando escolhida pelo usuário.",
      "Cloudflare: DNS, segurança, proteção contra abuso e, quando configurado, roteamento de e-mail.",
      "Groq: processamento de IA generativa.",
      "PostHog e Microsoft Clarity: analytics, quando habilitados e permitidos."
    ]
  },
  {
    title: "9. Retenção e exclusão",
    paragraphs: [
      "Mantemos dados pessoais pelo tempo necessário para cumprir as finalidades desta Política, executar contrato, manter histórico do usuário, cumprir obrigações legais, proteger a plataforma e exercer direitos.",
      "Documentos e históricos gerados podem ser mantidos enquanto a conta estiver ativa ou até solicitação de exclusão, observadas hipóteses legais de retenção. Logs técnicos e registros de segurança podem ser mantidos por prazo compatível com prevenção a fraude, auditoria, resposta a incidentes e obrigações do Marco Civil da Internet.",
      "Quando o usuário exclui a conta, a GlobalHire AI envidará esforços razoáveis para remover dados vinculados à conta, ressalvados dados cuja retenção seja necessária por obrigação legal, prevenção a fraude, segurança, cobrança, contabilidade ou exercício regular de direitos."
    ]
  },
  {
    title: "10. Segurança e logs técnicos",
    paragraphs: [
      "Adotamos medidas técnicas e administrativas proporcionais ao estágio do produto, incluindo autenticação, proteção de rotas, variáveis secretas no servidor, rate limit, segregação de chaves, controle de acesso, logs técnicos e provedores reconhecidos.",
      "Logs técnicos podem conter identificadores de usuário, IP, horário, rota acessada, status de erro, plano e metadados operacionais. Não devem conter conteúdo completo de currículos, descrições de vaga, documentos, telefone, endereço ou dados sensíveis, salvo se isso decorrer de envio indevido pelo usuário ou for tecnicamente inevitável em incidente específico."
    ]
  },
  {
    title: "11. Direitos dos titulares",
    paragraphs: [
      "Nos termos da LGPD, o titular pode solicitar confirmação da existência de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade, informação sobre compartilhamento, revisão de decisões automatizadas quando aplicável e revogação de consentimento.",
      "Solicitações devem ser enviadas para privacy@globalhireai.com.br. Poderemos solicitar informações adicionais para confirmar a identidade do solicitante e proteger a conta contra acesso indevido."
    ]
  },
  {
    title: "12. Crianças e adolescentes",
    paragraphs: [
      "A GlobalHire AI é direcionada a pessoas capazes de participar de processos profissionais e contratar serviços digitais. A plataforma não é destinada a crianças. Caso dados de menores sejam identificados de forma inadequada, poderemos remover o conteúdo ou solicitar informações adicionais conforme a legislação aplicável."
    ]
  },
  {
    title: "13. Contatos",
    paragraphs: [
      "Privacidade e LGPD: privacy@globalhireai.com.br. Suporte: support@globalhireai.com.br. Cobrança: billing@globalhireai.com.br. Contato geral: contato@globalhireai.com.br."
    ]
  },
  {
    title: "14. Alterações desta Política",
    paragraphs: [
      "Esta Política pode ser atualizada para refletir mudanças no produto, na legislação, nos provedores, nas práticas de segurança ou nas funcionalidades. Alterações relevantes serão publicadas nesta página e, quando necessário, comunicadas por meios razoáveis dentro da plataforma."
    ]
  }
];

export const termsIntro = [
  "Estes Termos de Uso regulam o acesso e uso da GlobalHire AI, plataforma SaaS de apoio profissional com inteligência artificial para otimização de currículos, análise ATS, preparação para entrevistas, tradução, geração de mensagens e documentos de candidatura.",
  "Ao criar conta, acessar a plataforma, contratar plano ou usar qualquer funcionalidade, o usuário declara que leu, compreendeu e concorda com estes Termos, com a Política de Privacidade e com as demais políticas aplicáveis."
];

export const termsSections: LegalSection[] = [
  {
    title: "1. Definições",
    paragraphs: [
      "Para fins destes Termos, GlobalHire AI significa a plataforma digital disponível em https://www.globalhireai.com.br e seus sistemas relacionados. Usuário é a pessoa natural que acessa, cria conta, envia dados, contrata plano ou utiliza funcionalidades. Conteúdo do Usuário inclui currículos, descrições de vaga, histórico profissional, preferências, documentos e comandos inseridos na plataforma.",
      "Resultados de IA são textos, scores, recomendações, documentos, mensagens, traduções e análises gerados automaticamente ou semiautomaticamente pela plataforma a partir de dados fornecidos pelo usuário."
    ]
  },
  {
    title: "2. Elegibilidade, cadastro e autenticação",
    paragraphs: [
      "O usuário deve possuir capacidade civil para contratar serviços digitais ou estar devidamente autorizado por representante legal. O usuário é responsável por fornecer informações verdadeiras, manter suas credenciais seguras e comunicar uso indevido da conta.",
      "A plataforma pode permitir cadastro por e-mail/senha e autenticação social via Google OAuth. O uso de provedor externo está sujeito à disponibilidade, políticas e permissões do próprio provedor."
    ]
  },
  {
    title: "3. Objeto da plataforma",
    paragraphs: [
      "A GlobalHire AI fornece ferramentas de apoio à carreira e mobilidade profissional, incluindo otimização de currículo ATS, geração de carta de apresentação, resumo de LinkedIn, mensagem para recrutador, simulação de entrevista, tradução e adaptação de currículo, análise de compatibilidade e recomendações de melhoria.",
      "A plataforma é instrumento de apoio e produtividade. Ela não substitui julgamento profissional humano, revisão final do usuário, consultoria de carreira individualizada, orientação jurídica, contábil, migratória ou garantia de contratação."
    ]
  },
  {
    title: "4. Obrigações do usuário",
    paragraphs: [
      "O usuário deve utilizar a plataforma de forma lícita, ética e compatível com estes Termos. O usuário é responsável pela veracidade das informações inseridas, pela revisão dos resultados e pela decisão de usar documentos gerados em processos seletivos."
    ],
    bullets: [
      "Não inserir informações falsas, enganosas ou que atribuam experiência, formação, certificação ou competência inexistente.",
      "Não usar a IA para fraude, falsificação documental, engenharia social, spam, assédio, discriminação ou violação de direitos de terceiros.",
      "Não tentar contornar limites de plano, rate limits, autenticação, cobrança, segurança, Turnstile, Stripe ou Supabase.",
      "Não enviar dados sensíveis desnecessários, dados de terceiros sem autorização ou documentos que não tenha direito de processar.",
      "Não copiar, raspar, revender, sublicenciar ou explorar a plataforma fora das permissões contratadas."
    ]
  },
  {
    title: "5. IA generativa e responsabilidade sobre resultados",
    paragraphs: [
      "Resultados de IA podem conter erros, omissões, inferências imprecisas, traduções inadequadas, termos incompatíveis com determinada vaga ou recomendações que não se aplicam ao caso concreto. O usuário deve revisar todo conteúdo antes de enviar a recrutadores, empresas, plataformas de vagas ou terceiros.",
      "A GlobalHire AI não garante entrevista, contratação, aprovação em ATS, resposta de recrutador, aumento de salário, obtenção de visto, recolocação ou qualquer resultado profissional. Scores e percentuais são estimativas automatizadas para orientação e priorização, não certificações objetivas."
    ]
  },
  {
    title: "6. Planos, assinaturas e pagamentos",
    paragraphs: [
      "A plataforma pode oferecer planos gratuitos e pagos, com limites de uso, recursos, preços e condições exibidos nas páginas de planos e checkout. Planos pagos são processados pelo Stripe e podem envolver cobrança recorrente.",
      "Upgrades, downgrades, cancelamentos, forma de pagamento, recibos e gestão de assinatura podem ser realizados pelo portal Stripe quando disponível. Alterações de plano podem produzir efeitos imediatos ou no próximo ciclo, conforme configuração da Stripe, regras do checkout e legislação aplicável."
    ]
  },
  {
    title: "7. Cancelamento e reembolso",
    paragraphs: [
      "O usuário pode cancelar a renovação da assinatura pelo portal de pagamentos ou pelo suporte, quando aplicável. O cancelamento interrompe cobranças futuras e, salvo indicação diversa, mantém acesso até o fim do período já pago.",
      "Pedidos de reembolso devem ser enviados para billing@globalhireai.com.br ou support@globalhireai.com.br e serão avaliados de boa-fé, considerando falha técnica comprovada, cobrança duplicada, impossibilidade de acesso atribuível à plataforma, prazo legal aplicável e efetiva utilização do serviço digital.",
      "Nada nestes Termos limita direitos irrenunciáveis do consumidor previstos na legislação brasileira."
    ]
  },
  {
    title: "8. Propriedade intelectual e licença de uso",
    paragraphs: [
      "A GlobalHire AI, sua marca, interface, código, estrutura, prompts internos, fluxos, design, banco de dados, textos institucionais e materiais próprios são protegidos por direitos de propriedade intelectual.",
      "O usuário mantém a titularidade sobre o Conteúdo do Usuário. Ao enviar conteúdo à plataforma, concede à GlobalHire AI licença limitada, revogável nos termos da legislação aplicável, não exclusiva e necessária para processar, armazenar, adaptar, gerar resultados, prestar suporte, cumprir obrigações legais e operar funcionalidades contratadas."
    ]
  },
  {
    title: "9. Disponibilidade, manutenção e limitações técnicas",
    paragraphs: [
      "A GlobalHire AI empregará esforços comercialmente razoáveis para manter a plataforma disponível, segura e funcional. Contudo, podem ocorrer indisponibilidades por manutenção, falhas de internet, provedores terceiros, Vercel, Supabase, Stripe, Google, Cloudflare, Groq, analytics, atualizações, incidentes ou eventos fora do controle razoável.",
      "Funcionalidades como upload de PDF/DOCX, extração de texto, geração de PDF e IA dependem de qualidade do arquivo, texto selecionável, limites técnicos, provedores externos e dados fornecidos pelo usuário."
    ]
  },
  {
    title: "10. Suspensão, bloqueio e proteção antifraude",
    paragraphs: [
      "A GlobalHire AI pode suspender, limitar ou bloquear contas quando houver suspeita razoável de fraude, abuso, violação destes Termos, tentativa de burlar limites, chargeback abusivo, uso automatizado indevido, risco de segurança ou determinação legal.",
      "Sempre que possível e proporcional, a plataforma poderá permitir regularização ou esclarecimento pelo usuário, salvo quando a comunicação comprometer investigação, segurança, prevenção a fraude ou cumprimento legal."
    ]
  },
  {
    title: "11. Proteção de dados",
    paragraphs: [
      "O tratamento de dados pessoais é regido pela Política de Privacidade, pela Política de Cookies e pelos documentos relacionados a tratamento de dados. O usuário deve evitar envio de dados sensíveis desnecessários e somente inserir dados de terceiros quando tiver base legal ou autorização adequada."
    ]
  },
  {
    title: "12. Responsabilidade proporcional",
    paragraphs: [
      "A responsabilidade da GlobalHire AI será apurada conforme a legislação brasileira, a natureza do serviço digital prestado, a conduta das partes, as informações disponíveis, as limitações técnicas informadas e o nexo causal comprovado.",
      "A GlobalHire AI não será responsável por decisões de recrutadores, empresas, plataformas de emprego, sistemas ATS externos, conteúdo falso inserido pelo usuário, uso indevido dos resultados, perda de oportunidade não comprovada, instabilidade causada por terceiros ou danos decorrentes de descumprimento destes Termos pelo usuário."
    ]
  },
  {
    title: "13. Alterações dos Termos",
    paragraphs: [
      "Estes Termos podem ser atualizados para refletir mudanças de produto, legislação, segurança, provedores, planos, cobrança ou modelo de operação. Alterações relevantes serão publicadas nesta página e, quando necessário, comunicadas por meios razoáveis."
    ]
  },
  {
    title: "14. Legislação aplicável e foro",
    paragraphs: [
      "Estes Termos são regidos pelas leis da República Federativa do Brasil, incluindo LGPD, Marco Civil da Internet, Código Civil e Código de Defesa do Consumidor quando aplicável.",
      "Eventuais conflitos serão submetidos ao foro competente conforme a legislação brasileira aplicável, preservados direitos do consumidor quanto ao foro de seu domicílio quando exigido por lei."
    ]
  },
  {
    title: "15. Contato jurídico e suporte",
    paragraphs: [
      "Contato geral: contato@globalhireai.com.br. Suporte: support@globalhireai.com.br. Privacidade: privacy@globalhireai.com.br. Cobrança: billing@globalhireai.com.br."
    ]
  }
];

export const cookiesSections: LegalSection[] = [
  {
    title: "1. Cookies essenciais",
    paragraphs: [
      "Cookies essenciais e tecnologias similares são necessários para autenticação, sessão, proteção de rotas, prevenção a fraude, segurança, preferências de idioma e funcionamento básico da plataforma. Sem eles, a GlobalHire AI pode não operar corretamente."
    ]
  },
  {
    title: "2. Cookies analíticos",
    paragraphs: [
      "Cookies analíticos e scripts de mensuração, como PostHog e Microsoft Clarity, podem ser usados para entender navegação, funis, conversões e melhoria de produto. Eles devem ser carregados apenas quando houver configuração técnica e consentimento adequado.",
      "Campos com currículo, descrição de vaga, upload, e-mail, telefone, endereço ou dados sensíveis devem ser mascarados ou excluídos de eventos analíticos."
    ]
  },
  {
    title: "3. Gestão de preferências",
    paragraphs: [
      "O usuário pode aceitar todos os cookies, rejeitar analytics ou abrir preferências pelo banner de cookies e pelo link no rodapé. A rejeição de analytics não impede o uso de cookies essenciais."
    ]
  }
];

export const refundSections: LegalSection[] = [
  {
    title: "1. Cancelamento",
    paragraphs: [
      "Assinaturas podem ser canceladas pelo Stripe Customer Portal, quando disponível, ou por solicitação ao suporte. O cancelamento interrompe renovações futuras e normalmente mantém o acesso até o término do ciclo já pago."
    ]
  },
  {
    title: "2. Reembolsos",
    paragraphs: [
      "Pedidos de reembolso devem ser enviados para billing@globalhireai.com.br ou support@globalhireai.com.br. A avaliação considerará cobrança duplicada, falha técnica comprovada, impossibilidade de uso atribuível à plataforma, prazo legal aplicável e efetiva utilização do serviço.",
      "A política será aplicada de forma compatível com o Código de Defesa do Consumidor, sem afastar direitos legais irrenunciáveis."
    ]
  },
  {
    title: "3. Stripe",
    paragraphs: [
      "A efetivação operacional de estornos, recibos, atualização de cartões e cancelamentos depende da Stripe e pode seguir prazos bancários, regras de bandeira e métodos de pagamento."
    ]
  }
];

export const dataProcessingSections: LegalSection[] = [
  {
    title: "1. Papéis de tratamento",
    paragraphs: [
      "A GlobalHire AI atua como controladora em relação a contas, assinaturas, limites de plano, histórico, documentos e uso do produto. Provedores como Supabase, Stripe, Vercel, Cloudflare, Groq, PostHog e Microsoft Clarity podem atuar como operadores ou controladores independentes, conforme suas atividades."
    ]
  },
  {
    title: "2. Dados profissionais",
    paragraphs: [
      "Currículos, descrições de vagas e documentos profissionais são tratados para executar solicitações do usuário. O usuário deve evitar dados sensíveis ou dados de terceiros desnecessários."
    ]
  },
  {
    title: "3. Segurança e retenção",
    paragraphs: [
      "A plataforma aplica controles técnicos proporcionais ao estágio do produto, incluindo autenticação, proteção de rotas, rate limit, logs técnicos, variáveis secretas no servidor e provedores reconhecidos. Dados são retidos pelo tempo necessário à prestação do serviço, cumprimento legal, segurança e exercício de direitos."
    ]
  }
];

export const supportSections: LegalSection[] = [
  {
    title: "1. Canais oficiais",
    paragraphs: [
      "Suporte geral: support@globalhireai.com.br. Cobrança: billing@globalhireai.com.br. Privacidade e LGPD: privacy@globalhireai.com.br. Contato institucional: contato@globalhireai.com.br."
    ]
  },
  {
    title: "2. Assinatura e cancelamento",
    paragraphs: [
      "Para gerenciar assinatura, acesse a área Assinatura dentro da conta e abra o portal Stripe. Se não conseguir acessar, envie e-mail ao suporte com o e-mail da conta e uma descrição objetiva do problema."
    ]
  },
  {
    title: "3. IA e documentos",
    paragraphs: [
      "A IA pode gerar resultados imprecisos. Revise documentos antes de usar em candidaturas. PDFs escaneados podem não ter texto selecionável; nesses casos, cole o texto manualmente."
    ]
  }
];
