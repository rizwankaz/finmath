module LR

using SpecialFunctions

function norm_cdf(x::Float64)
    return 0.5 * (1.0 + erf(x / sqrt(2.0)))
end

function LeisenReimer(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, is_call::Bool)
    δt = T / N
    
    # Compute d1 and d2
    d1 = (log(S / K) + (r + 0.5 * σ^2) * T) / (σ * sqrt(T))
    d2 = d1 - σ * sqrt(T)
    
    # Compute probabilities
    p_u = norm_cdf(d1 * sqrt((N + 1/3) + 0.1 / (N + 1)))
    p_d = norm_cdf(d2 * sqrt((N + 1/3) + 0.1 / (N + 1)))
    
    # Compute up and down factors
    u = exp(σ * sqrt(δt))
    d = 1 / u
    
    # Compute risk-neutral probability
    p = (exp(r * δt) - d) / (u - d)
    
    # Initialize asset prices at maturity
    ST = [S * u^(N - i) * d^i for i in 0:N]
    
    # Calculate option payoffs at maturity
    if is_call
        C = max.(ST .- K, 0.0)
    else
        C = max.(K .- ST, 0.0)
    end
    
    # Work backwards through the tree
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