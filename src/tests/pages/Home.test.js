import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import api from '../../components/Api';
import '@testing-library/jest-dom';

jest.mock('../../components/Api', () => ({
    get: jest.fn().mockImplementation(() => {
        return Promise.resolve({});
    })
}));

jest.mock("../../components/Carousel/Carousel", () => {
    return function MockCarousel({ children }) {
        return <div>{children}</div>;
    };
});

describe("Halaman Home", () => {
    // Tes jika komponen dirender dengan benar
    test("Render elemen utama pada halaman Home", () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Pastikan Carousel dan judul bagian tampil
        expect(screen.getByText(/Popular Movies/i)).toBeInTheDocument();
        expect(screen.getByText(/Recent Movies/i)).toBeInTheDocument();
    });

    // Tes API Fetching untuk popular movies
    test("Fetching API untuk Popular Movies", async () => {
        const mockPopularMovies = {
            data: {
                results: [
                    { id: 1, title: "Popular Movie 1" },
                    { id: 2, title: "Popular Movie 2" },
                ],
            },
        };
    
        api.get.mockResolvedValueOnce(mockPopularMovies); // Mock response API
    
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
    
        // Pastikan ada dua spinner (progressbar) untuk Popular dan Recent Movies
        const spinners = screen.getAllByRole("progressbar");
        expect(spinners.length).toBe(2);
    
        // Tunggu hingga data Popular Movies tampil
        await waitFor(() => {
            expect(screen.getByText("Popular Movie 1")).toBeInTheDocument();
            expect(screen.getByText("Popular Movie 2")).toBeInTheDocument();
        });
    });

    // Tes API Fetching untuk recent movies
    test("Fetching API untuk Recent Movies", async () => {
        const mockRecentMovies = {
            data: {
                results: [
                    { id: 1, title: "Recent Movie 1" },
                    { id: 2, title: "Recent Movie 2" },
                ],
            },
        };

        api.get.mockResolvedValueOnce(mockRecentMovies); // Mock response API

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Pastikan spinner muncul sebelum data dimuat
        const spinners = screen.getAllByRole("progressbar");
        expect(spinners.length).toBe(2);

        // Tunggu hingga data Recent Movies tampil
        await waitFor(() => {
            expect(screen.getByText("Recent Movie 1")).toBeInTheDocument();
            expect(screen.getByText("Recent Movie 2")).toBeInTheDocument();
        });
    });

    // Tes navigasi tombol View More
    test("Navigasi tombol View More untuk Popular Movies bekerja dengan benar", async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
    
        // Tunggu hingga tombol dengan teks "View More" dan href "/cat/popular-movies" muncul
        const popularButton = await screen.findByText((content, element) => {
            return (
                element.tagName.toLowerCase() === "a" &&
                content.includes("View More") &&
                element.getAttribute("href") === "/cat/popular-movies"
            );
        });
    
        // Validasi tombol ditemukan
        expect(popularButton).toBeInTheDocument();
        expect(popularButton).toHaveAttribute("href", "/cat/popular-movies");
    });         
});
