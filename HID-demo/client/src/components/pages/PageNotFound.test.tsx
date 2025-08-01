import { getByText, render } from "@testing-library/react";
import PageNotFound from "./PageNotFound";
test("Page not found",()=>{
    const {getByText}=render(<PageNotFound/>)
    expect(getByText("404! Page not found.")).toBeInTheDocument()
})