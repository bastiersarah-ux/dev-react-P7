import { ACCESS_TOKEN_COOKIE } from "@front/helpers/auth-cookie";
import { NextRequest, NextResponse } from "next/server";

/**
 * URL de l'API backend
 * On utilise une variable d'environnement sinon localhost par défaut
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Durée de vie du cookie en secondes (1 semaine) */
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

/**
 * Fonction principale qui transfère les requêtes vers le backend
 * Elle gère les headers, le token JWT et les cookies
 * C'est le coeur du proxy
 */
async function forwardRequest(req: NextRequest) {
    // On retire le préfixe /api/proxy pour avoir le vrai chemin
    const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, "");
    const targetUrl = `${API_URL}${path}${req.nextUrl.search}`;

    // GET et HEAD n'ont pas de body
    const body =
        req.method === "GET" || req.method === "HEAD"
            ? undefined
            : await req.text();

    // On copie les headers mais on enlève ceux qui posent problème
    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("connection");

    // Si on envoie un body, on met le content-type en JSON
    if (body && !headers.has("content-type")) {
        headers.set("Content-Type", "application/json");
    }

    // On récupère le token depuis les cookies et on l'ajoute en header
    const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // Appel au backend
    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
            cache: "no-store",
        });
    } catch (error: any) {
        // Si le backend ne répond pas, on renvoie une erreur 502
        return NextResponse.json(
            {
                success: false,
                message:
                    "Impossible de joindre l'API. Vérifiez que le backend tourne et que NEXT_PUBLIC_API_URL est correct.",
                details: error?.message,
            },
            { status: 502 },
        );
    }

    // On parse la réponse JSON du backend
    const data = await backendResponse.json().catch(() => null);

    // On crée la réponse à renvoyer au client
    const response = NextResponse.json(data ?? {}, {
        status: backendResponse.status,
    });

    // Si le backend renvoie un token, on le stocke dans un cookie httpOnly
    // C'est plus sécurisé que de le stocker en localStorage
    if (backendResponse.ok && data?.data?.token) {
        response.cookies.set({
            name: ACCESS_TOKEN_COOKIE,
            value: data.data.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ONE_WEEK_SECONDS,
            path: "/",
        });
    } else if (backendResponse.status === 401) {
        // Si 401, on supprime le cookie car le token n'est plus valide
        response.cookies.set({
            name: ACCESS_TOKEN_COOKIE,
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        });
    }

    return response;
}

/** Handler GET */
export async function GET(req: NextRequest) {
    return forwardRequest(req);
}

/** Handler POST */
export async function POST(req: NextRequest) {
    return forwardRequest(req);
}

/** Handler PUT */
export async function PUT(req: NextRequest) {
    return forwardRequest(req);
}

/** Handler PATCH */
export async function PATCH(req: NextRequest) {
    return forwardRequest(req);
}

/** Handler DELETE */
export async function DELETE(req: NextRequest) {
    return forwardRequest(req);
}
