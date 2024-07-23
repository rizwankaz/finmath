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
 
    p = inversion(h1)
    p_u = inversion(h2)
    
    u = exp(σ * sqrt(δt))
    d = 1 / u
    
    ST = [S * u^(N - i) * d^i for i in 0:N]
    
    if is_call
        C = max.(ST .- K, 0.0)
    else
        C = max.(K .- ST, 0.0)
    end
    
    for i in N:-1:1
        C = (p * C[1:i] + (1 - p) * C[2:i+1]) * exp(-r * δt)
    end
    
    return C[1]
end

LRput(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    LeisenReimer(S, K, T, r, σ, N, false)

LRcall(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    LeisenReimer(S, K, T, r, σ, N, true)

export LRput, LRcall

end