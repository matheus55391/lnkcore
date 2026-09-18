import type { Metadata } from "next";
import Link from "next/link";
import { LogoTheme } from "@/components/logo-theme";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso do MakeBio: conta, páginas públicas, planos e responsabilidades.",
};

const SECTIONS = [
  { id: "aceitacao", label: "Aceitação dos termos" },
  { id: "servico", label: "O que é o serviço" },
  { id: "conta", label: "Conta e elegibilidade" },
  { id: "conteudo", label: "Seu conteúdo" },
  { id: "uso-proibido", label: "Uso proibido" },
  { id: "planos", label: "Planos e pagamentos" },
  { id: "disponibilidade", label: "Disponibilidade" },
  { id: "responsabilidade", label: "Limitação de responsabilidade" },
  { id: "encerramento", label: "Encerramento" },
  { id: "alteracoes", label: "Alterações" },
  { id: "lei", label: "Lei aplicável" },
  { id: "contato", label: "Contato" },
] as const;

export default function TermosPage() {
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
        <h1>Termos de Uso</h1>
        <p className="legal-meta">
          <strong>Vigência:</strong> 18 de setembro de 2026
        </p>

        <p>
          Estes Termos de Uso regem o acesso e o uso do{" "}
          <strong>MakeBio</strong> (
          <a href="https://www.makebio.com.br">makebio.com.br</a>). Ao criar uma
          conta ou usar o serviço, você concorda com estes termos e com o{" "}
          <Link href="/privacidade">Aviso de Privacidade</Link>.
        </p>

        <nav className="legal-toc" aria-label="Sumário">
          <p className="legal-toc-title">Nestes termos</p>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <section id="aceitacao">
          <h2>Aceitação dos termos</h2>
          <p>
            Se você não concordar com estes termos, não use o MakeBio. O uso
            contínuo após alterações publicadas nesta página implica aceitação
            da versão vigente.
          </p>
        </section>

        <section id="servico">
          <h2>O que é o serviço</h2>
          <p>
            O MakeBio é uma plataforma de “link na bio”: permite criar páginas
            públicas com foto, bio, links e ícones de redes sociais, e
            compartilhá-las por um endereço único (por exemplo,{" "}
            <code>makebio.com.br/seunome</code>).
          </p>
          <p>
            Páginas publicadas são, por padrão,{" "}
            <strong>públicas e acessíveis a qualquer pessoa</strong> com o link.
          </p>
        </section>

        <section id="conta">
          <h2>Conta e elegibilidade</h2>
          <ul>
            <li>
              Você deve fornecer informações verdadeiras e manter a senha em
              sigilo.
            </li>
            <li>
              Você é responsável por toda atividade realizada na sua conta.
            </li>
            <li>
              O serviço não se destina a menores de 13 anos. Menores entre 13 e
              18 anos só devem usar o MakeBio com autorização adequada.
            </li>
          </ul>
        </section>

        <section id="conteudo">
          <h2>Seu conteúdo</h2>
          <p>
            Você mantém a titularidade do conteúdo que publica (textos, imagens,
            URLs e redes). Ao publicar, você nos concede licença limitada para
            hospedar, exibir e processar esse conteúdo apenas para operar o
            serviço.
          </p>
          <p>
            Você declara ter direito de usar o conteúdo publicado e que ele não
            viola lei, direitos de terceiros nem estes termos.
          </p>
        </section>

        <section id="uso-proibido">
          <h2>Uso proibido</h2>
          <p>É vedado, entre outros:</p>
          <ul>
            <li>
              conteúdo ilegal, fraudulento, difamatório, discriminatório ou que
              explore menores;
            </li>
            <li>spam, phishing, malware ou links enganosos;</li>
            <li>
              tentativa de acesso não autorizado, sobrecarga ou interferência no
              serviço;
            </li>
            <li>
              uso da marca MakeBio de forma que sugira parceria ou endosso sem
              autorização.
            </li>
          </ul>
          <p>
            Podemos remover conteúdo, suspender ou encerrar contas em caso de
            violação. Denúncias:{" "}
            <Link href="/denunciar">makebio.com.br/denunciar</Link>.
          </p>
        </section>

        <section id="planos">
          <h2>Planos e pagamentos</h2>
          <ul>
            <li>
              O plano <strong>Free</strong> inclui limites de páginas, links e
              imagens descritos no produto.
            </li>
            <li>
              O plano <strong>PRO</strong> é pago de forma recorrente via Stripe.
              Ao assinar, você autoriza a cobrança conforme o preço vigente no
              checkout.
            </li>
            <li>
              Você pode cancelar a renovação pelo painel (Billing). O acesso PRO
              permanece até o fim do período já pago, salvo disposição em
              contrário na fatura ou na lei aplicável.
            </li>
            <li>
              Preços e limites podem mudar; alterações relevantes serão
              comunicadas com antecedência razoável quando aplicável.
            </li>
            <li>
              Não armazenamos o número completo do cartão; o pagamento é
              processado pelo provedor de pagamento.
            </li>
          </ul>
        </section>

        <section id="disponibilidade">
          <h2>Disponibilidade</h2>
          <p>
            Buscamos manter o serviço estável, mas não garantimos
            disponibilidade ininterrupta. Manutenções, falhas de rede ou de
            provedores terceiros (hospedagem, armazenamento, e-mail, pagamentos)
            podem ocorrer.
          </p>
        </section>

        <section id="responsabilidade">
          <h2>Limitação de responsabilidade</h2>
          <p>
            O MakeBio é oferecido “como está”, na medida permitida pela lei. Na
            máxima extensão legal, não nos responsabilizamos por lucros
            cessantes, perda de dados, danos indiretos ou por conteúdo publicado
            por usuários ou por sites de terceiros vinculados às páginas.
          </p>
          <p>
            Links externos (Instagram, lojas, WhatsApp etc.) são de
            responsabilidade de quem os publica e dos respectivos destinos.
          </p>
        </section>

        <section id="encerramento">
          <h2>Encerramento</h2>
          <p>
            Você pode excluir a conta pelo painel (Perfil). Podemos suspender ou
            encerrar o acesso em caso de violação destes termos, risco à
            plataforma ou obrigação legal. Após o encerramento, páginas e dados
            associados podem ser removidos conforme o{" "}
            <Link href="/privacidade">Aviso de Privacidade</Link>.
          </p>
        </section>

        <section id="alteracoes">
          <h2>Alterações</h2>
          <p>
            Podemos atualizar estes termos. A data de vigência no topo indica a
            versão atual. Alterações relevantes podem ser comunicadas por e-mail
            ou aviso no produto.
          </p>
        </section>

        <section id="lei">
          <h2>Lei aplicável</h2>
          <p>
            Estes termos são regidos pelas leis da República Federativa do
            Brasil. Foro da comarca do domicílio do usuário consumidor, quando
            aplicável o Código de Defesa do Consumidor; nos demais casos, foro
            competente conforme a legislação vigente.
          </p>
        </section>

        <section id="contato">
          <h2>Contato</h2>
          <p>
            Dúvidas sobre estes termos:
            <br />
            <a href="mailto:matheus.felipe55391@gmail.com">
              matheus.felipe55391@gmail.com
            </a>
          </p>
          <p>
            MakeBio —{" "}
            <a href="https://www.makebio.com.br">www.makebio.com.br</a>
          </p>
        </section>
      </main>

      <footer className="legal-footer">
        <p>© {new Date().getFullYear()} MakeBio</p>
        <div>
          <Link href="/privacidade">Privacidade</Link>
          <span aria-hidden> · </span>
          <Link href="/">Início</Link>
          <span aria-hidden> · </span>
          <Link href="/sign-up">Criar conta</Link>
        </div>
      </footer>
    </div>
  );
}
