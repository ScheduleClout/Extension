export const Heart = {
    /**
     * @return {boolean}
     */
    async Beat() {
        let response = await fetch(`https://${process.env.NODE_API_HOSTNAME}/`, {method: 'GET'}),
            text = await response.clone().text();

        return text.trim() === 'Your BitClout node is running!';
    }
};
