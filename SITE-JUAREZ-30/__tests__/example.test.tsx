import { render, screen } from "@testing-library/react"
import Home from "../app/(public)/page" // Exemplo de import de uma página pública

describe("Home Page", () => {
  it("renders a heading", () => {
    render(<Home />) // Renderiza o componente Home

    const heading = screen.getByRole("heading", { name: /Bem-vindo ao Siqueira Campos Imóveis/i }) // Procura por um heading com o texto
    expect(heading).toBeInTheDocument() // Verifica se o heading está no documento
  })

  // Você pode adicionar mais testes aqui, por exemplo:
  // it('renders a call to action button', () => {
  //   render(<Home />);
  //   const ctaButton = screen.getByRole('button', { name: /Explorar Imóveis/i });
  //   expect(ctaButton).toBeInTheDocument();
  // });
})
