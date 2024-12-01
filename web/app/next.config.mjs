import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['www.imshawan.dev'],
    },
    webpack: (config, { isServer }) => {
        // Only run this plugin on the client-side
        if (!isServer) {
            config.plugins.push(
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: path.resolve(__dirname, "node_modules/ace-builds/src-noconflict"),
                            to: path.resolve(__dirname, "public/ace-builds"),
                        },
                    ],
                })
            );
        }
        return config;
    },
};

export default nextConfig;
