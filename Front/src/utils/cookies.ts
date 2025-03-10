export const getCookie = (name: string): number | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue ? parseInt(cookieValue, 10) : null;
    }
    return null;
};