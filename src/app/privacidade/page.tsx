import type { Metadata } from "next";
import Link from "next/link";
import { LogoTheme } from "@/components/logo-theme";

export const metadata: Metadata = {
  title: "Aviso de Privacidade",
  description:
    "Como o MakeBio coleta, usa e protege dados pessoais de criadores e visitantes.",
};

const SECTIONS = [
  { id: "o-que-fazemos", label: "O que o MakeBio faz?" },
  { id: "a-quem-se-aplica", label: "A quem este aviso se aplica?" },
  { id: "terceiros", label: "Links e serviços de terceiros" },
  { id: "dados-coletados", label: "Informações que coletamos" },
  { id: "como-usamos", label: "Como usamos as informações" },
  { id: "cookies", label: "Cookies e tecnologias semelhantes" },
  { id: "retencao", label: "Por quanto tempo guardamos os dados" },
  { id: "seguranca", label: "Como protegemos seus dados" },
  { id: "seus-direitos", label: "Seus direitos (LGPD)" },
  { id: "criancas", label: "Dados de crianças e adolescentes" },
  { id: "alteracoes", label: "Alterações neste aviso" },
  { id: "contato", label: "Fale conosco" },
] as const;

export default function PrivacidadePage() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link href="/" className="legal-brand">
          <LogoTheme force="light" />
          <span>MakeBio</span>
        </Link>
        <Link href="/" className="legal-back">
          Voltar ao início
        </Link>
      </header>

      <main className="legal-main">
        <h1>Aviso de Privacidade</h1>
        <p className="legal-meta">
          <strong>Vigência:</strong> 31 de julho de 2026
        </p>

        <p>
          Este Aviso de Privacidade descreve como o <strong>MakeBio</strong>{" "}
          (<a href="https://www.makebio.com.br">makebio.com.br</a>) coleta, usa,
          compartilha e protege dados pessoais. Ao criar uma conta ou visitar
          páginas públicas do MakeBio, você declara ter lido e compreendido este
          aviso.
        </p>

        <nav className="legal-toc" aria-label="Sumário">
          <p className="legal-toc-title">Neste aviso</p>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <section id="o-que-fazemos">
          <h2>O que o MakeBio faz?</h2>
          <p>
            O MakeBio é uma plataforma de “link na bio”: permite que criadores e
            negócios montem uma página pública com foto, bio, links clássicos e
            ícones de redes sociais, e compartilhem um endereço único (por
            exemplo, <code>makebio.com.br/seunome</code>).
          </p>
          <p>
            As páginas publicadas são, por padrão,{" "}
            <strong>públicas e acessíveis a qualquer pessoa</strong> que tenha o
            link. O conteúdo que você coloca na página (título, bio, foto, URLs e
            redes) fica visível para visitantes.
          </p>
        </section>

        <section id="a-quem-se-aplica">
          <h2>A quem este aviso se aplica?</h2>
          <p>Este aviso cobre o tratamento de dados pessoais em que o MakeBio atua como controlador, incluindo:</p>
          <ul>
            <li>pessoas que criam conta e gerenciam páginas no MakeBio;</li>
            <li>visitantes que acessam páginas públicas do MakeBio;</li>
            <li>
              pessoas que entram em contato conosco por e-mail ou formulários de
              suporte/denúncia.
            </li>
          </ul>
          <p>
            Quando um visitante clica em um link da sua página e vai para um site
            de terceiro (Instagram, loja, WhatsApp etc.), o tratamento feito por
            esse terceiro segue a política de privacidade dele — não a nossa.
          </p>
        </section>

        <section id="terceiros">
          <h2>Links e serviços de terceiros</h2>
          <p>
            O MakeBio conecta visitantes ao conteúdo que você escolheu. Depois
            que o visitante sai do MakeBio, não controlamos como o destino usa
            os dados. Recomendamos revisar as políticas de privacidade das
            plataformas e sites vinculados.
          </p>
        </section>

        <section id="dados-coletados">
          <h2>Informações que coletamos</h2>

          <h3>1. Dados que você fornece</h3>
          <ul>
            <li>
              <strong>Conta:</strong> nome, e-mail e senha (armazenada de forma
              criptografada/hashed).
            </li>
            <li>
              <strong>Página pública:</strong> slug, título, bio, foto de perfil,
              links, emojis/ícones e imagens de links, redes sociais e tema.
            </li>
            <li>
              <strong>Assinatura (plano PRO):</strong> dados de cobrança
              processados por nosso provedor de pagamento; não armazenamos o
              número completo do cartão em nossos servidores.
            </li>
            <li>
              <strong>Comunicações:</strong> mensagens enviadas ao suporte ou em
              pedidos de redefinição de senha.
            </li>
          </ul>

          <h3>2. Dados coletados automaticamente</h3>
          <ul>
            <li>
              endereço IP aproximado, tipo de dispositivo/navegador, páginas
              acessadas e horário de acesso (logs técnicos e segurança);
            </li>
            <li>
              cookies essenciais de sessão e, se você autorizar, cookies de
              preferências/desempenho (veja Preferências de cookies nas páginas
              públicas).
            </li>
          </ul>

          <h3>3. Dados de armazenamento de arquivos</h3>
          <p>
            Fotos de perfil e imagens de links são enviadas ao nosso
            armazenamento de objetos (compatível com S3) e ficam associadas à
            sua conta/página.
          </p>
        </section>

        <section id="como-usamos">
          <h2>Como usamos as informações</h2>
          <ul>
            <li>criar e manter sua conta e páginas;</li>
            <li>exibir sua página pública aos visitantes;</li>
            <li>processar planos pagos e limites do plano gratuito;</li>
            <li>enviar e-mails transacionais (ex.: redefinição de senha);</li>
            <li>proteger a plataforma contra abuso, fraude e uso indevido;</li>
            <li>cumprir obrigações legais e responder a solicitações válidas;</li>
            <li>
              melhorar o produto com base em métricas agregadas e não
              identificáveis, quando possível.
            </li>
          </ul>
          <p>
            Bases legais típicas (LGPD): execução de contrato, legítimo
            interesse (segurança e melhoria do serviço), consentimento (cookies
            não essenciais) e obrigação legal.
          </p>
        </section>

        <section id="cookies">
          <h2>Cookies e tecnologias semelhantes</h2>
          <p>
            Usamos cookies estritamente necessários para autenticação e
            funcionamento do site. Cookies de desempenho, funcionais ou de
            publicidade só são usados se você optar por ativá-los nas
            Preferências de cookies. Você pode alterar a escolha a qualquer
            momento no rodapé das páginas públicas.
          </p>
        </section>

        <section id="retencao">
          <h2>Por quanto tempo guardamos os dados</h2>
          <p>
            Mantemos os dados enquanto sua conta estiver ativa e pelo tempo
            necessário para cumprir o contrato, obrigações legais ou resolver
            disputas. Ao excluir a conta, removemos páginas, links e, na medida
            do possível, arquivos no armazenamento. Logs de segurança podem ser
            retidos por período limitado.
          </p>
        </section>

        <section id="seguranca">
          <h2>Como protegemos seus dados</h2>
          <p>
            Adotamos medidas razoáveis de segurança (HTTPS, hashing de senhas,
            controle de acesso à conta e cotas de upload). Nenhum sistema é 100%
            seguro; se souber de um incidente, entre em contato conosco.
          </p>
        </section>

        <section id="seus-direitos">
          <h2>Seus direitos (LGPD)</h2>
          <p>
            Se você for titular de dados no Brasil, pode solicitar, entre outros:
            confirmação de tratamento, acesso, correção, anonimização/bloqueio
            ou eliminação de dados desnecessários, portabilidade (quando
            aplicável), informação sobre compartilhamentos e revogação de
            consentimento.
          </p>
          <p>
            Para exercer direitos, use o e-mail em{" "}
            <a href="#contato">Fale conosco</a>. Também é possível excluir a
            conta pelo painel (Perfil → zona de exclusão), o que remove seus
            dados principais do produto.
          </p>
        </section>

        <section id="criancas">
          <h2>Dados de crianças e adolescentes</h2>
          <p>
            O MakeBio não se destina a menores de 13 anos. Contas e páginas
            devem ser usadas apenas por quem tenha capacidade legal ou
            autorização adequada. Se identificarmos dados de crianças em
            desacordo com a lei, poderemos remover a conta ou o conteúdo.
          </p>
        </section>

        <section id="alteracoes">
          <h2>Alterações neste aviso</h2>
          <p>
            Podemos atualizar este aviso para refletir mudanças no produto ou na
            lei. A data de vigência no topo indica a versão atual. Alterações
            relevantes podem ser comunicadas por e-mail ou aviso no produto.
          </p>
        </section>

        <section id="contato">
          <h2>Fale conosco</h2>
          <p>
            Dúvidas sobre privacidade ou pedidos relacionados à LGPD:
            <br />
            <a href="mailto:privacidade@makebio.com.br">
              privacidade@makebio.com.br
            </a>
          </p>
          <p>
            Controlador: MakeBio — operação digital em{" "}
            <a href="https://www.makebio.com.br">www.makebio.com.br</a>.
          </p>
        </section>
      </main>

      <footer className="legal-footer">
        <p>© {new Date().getFullYear()} MakeBio</p>
        <div>
          <Link href="/">Início</Link>
          <span aria-hidden> · </span>
          <Link href="/sign-up">Criar conta</Link>
        </div>
      </footer>
    </div>
  );
}
