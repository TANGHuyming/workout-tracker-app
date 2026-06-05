export const fetchCsrfToken = async (): Promise<string | null> => {
    try {
        const response = await fetch("/api/csrf", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch CSRF token");
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}