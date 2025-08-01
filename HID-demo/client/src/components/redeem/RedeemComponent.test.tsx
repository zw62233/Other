import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { serviceCall } from "../../service/service";
import RedeemComponent from "./RedeemComponent";

jest.mock("../../service/service", () => ({
  serviceCall: jest.fn(),
}));

describe("LoginComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with default values", () => {
    render(<RedeemComponent />);
    expect(screen.getByText("SIGN IN")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type Login Id here")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("enables Next button when loginId is entered", () => {
    render(<RedeemComponent />);
    fireEvent.change(screen.getByPlaceholderText("Type Login Id here"), {
      target: { value: "testUser" },
    });
    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  it("displays an error message when login fails", async () => {
    (serviceCall as jest.Mock).mockRejectedValueOnce({
      response: {
        data: btoa(JSON.stringify({ statusCode: 400, message: "Invalid credentials" })),
      },
    });
    render(<RedeemComponent />);
    fireEvent.change(screen.getByPlaceholderText("Type Login Id here"), {
      target: { value: "testUser" },
    });
    fireEvent.click(screen.getByText("Next"));
    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    );
  });

  it("requires organization code when 409 status is received", async () => {
    (serviceCall as jest.Mock).mockRejectedValueOnce({
      response: {
        data: btoa(JSON.stringify({ statusCode: 409, message: "Org code required" })),
      },
    });

    render(<RedeemComponent />);

    fireEvent.change(screen.getByPlaceholderText("Type Login Id here"), {
      target: { value: "testUser" },
    });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => expect(screen.getByText("Org code required")).toBeInTheDocument());
    expect(screen.getByPlaceholderText("Type Organization Code here")).toBeInTheDocument();
  });

  it("check input field of orgcode and back button", async () => {
    (serviceCall as jest.Mock).mockRejectedValueOnce({
      response: {
        data: btoa(JSON.stringify({ statusCode: 409, message: "Org code required" })),
      },
    });
    render(<RedeemComponent />);
    fireEvent.change(screen.getByPlaceholderText("Type Login Id here"), {
      target: { value: "testUser" },
    });
    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => expect(screen.getByText("Org code required")).toBeInTheDocument());
    const orgcode=screen.getByPlaceholderText("Type Organization Code here")
    expect(orgcode).toBeInTheDocument();
    fireEvent.change(orgcode,{target:{value:"orgcode"}})
    expect(screen.getByText("Next")).not.toBeDisabled();
    const backbutton=screen.getByText("Back")
    expect(backbutton).toBeInTheDocument()
    fireEvent.click(backbutton)
  });

  it("redirects to SSO URL on successful login", async () => {
    const ssoUrl = "https://sso.example.com";
    (serviceCall as jest.Mock).mockResolvedValueOnce({
      data: btoa(JSON.stringify({ statusCode: 200, url: ssoUrl })),
    });

    delete (window as any).location;
    window.location = { href: "" } as any;

    render(<RedeemComponent />);

    fireEvent.change(screen.getByPlaceholderText("Type Login Id here"), {
      target: { value: "testUser" },
    });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => expect(window.location.href).toBe(ssoUrl));
  });

  it("shows SSO URL not found error", async () => {
    (serviceCall as jest.Mock).mockResolvedValueOnce({
      data: btoa(JSON.stringify({ statusCode: 200 })),
    });

    render(<RedeemComponent />);

    fireEvent.change(screen.getByPlaceholderText("Type Login Id here"), {
      target: { value: "testUser" },
    });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() =>
      expect(screen.getByText("SSO URL not found")).toBeInTheDocument()
    );
  });
});
