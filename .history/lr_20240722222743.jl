module LR

using SpecialFunctions

function inversion(z::Float64)
    a = 0.332672527
    b = 1.0 / 1.784
    c = -0.017337
    return 0.5 + sign(z) * sqrt(0.25 - 0.25 * exp(-((a * abs(z) + b)^2 - c)))
end

function LeisenReimer(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, is_call::Bool)
    δt = T / N
    d1 = (log(S / K) + (r + 0.5 * σ^2) * T) / (σ * sqrt(T))
    d2 = d1 - σ * sqrt(T)

    h1 = d1 * sqrt((N + 1/3) / (T * (N + 1/6)))
    h2 = d2 * sqrt((N + 1/3) / (T * (N + 1/6)))

    p1 = inversion(h1)
    p2 = inversion(h2)

    u = S * exp(r * T) * (p1 / p2)
    d = S * exp(r * T) * ((1 - p1) / (1 - p2))

    p = (exp(r * δt) - d) / (u - d)

    ST = [max(u^j * d^(N-j) * S - K, 0.0) for j in 0:N]

    if !is_call
        ST = [max(K - u^j * d^(N-j) * S, 0.0) for j in 0:N]
    end

    for i in N:-1:1
        ST = [exp(-r * δt) * (p * ST[j+1] + (1-p) * ST[j]) for j in 1:i]
    end

    return ST[1]
end

LRput(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    LeisenReimer(S, K, T, r, σ, N, false)

LRcall(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    LeisenReimer(S, K, T, r, σ, N, true)

export LRput, LRcall

end