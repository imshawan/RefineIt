interface MenuItem {
    label: string;
    icon?: string; // `icon` is optional here
    command?: () => void;
    items?: MenuItem[];
}

export function removeIcons(items: MenuItem[]): MenuItem[] {
    return items.map(item => {
        const { icon, ...rest } = item;
        if (rest.items) {
            return {
                ...rest,
                items: removeIcons(rest.items) // Recursive call
            };
        }
        return rest;
    });
}
