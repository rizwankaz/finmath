module LR

using SpecialFunctions

@inline norm_cdf(x::Float64) = 0.5 * (1.0 + erf(x / sqrt(2.0)))

function LeisenReimer(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, is_call::Bool)
    δt = T / N
    sqrtδt = sqrt(δt)
    
    d1 = (log(S / K) + (r + 0.5 * σ^2) * T) / (σ * sqrt(T))
    d2 = d1 - σ * sqrt(T)
    
    N_adj = sqrt((N + 1/3) + 0.1 / (N + 1))
    p_u = norm_cdf(d1 * N_adj)
    p_d = norm_cdf(d2 * N_adj)
    
    u = exp(σ * sqrtδt)
    d = 1 / u
    
    p = (exp(r * δt) - d) / (u - d)
    disc = exp(-r * δt)
    
    u_power = u^N
    d_power = 1.0
    
    ST = Vector{Float64}(undef, N + 1)
    for i in 0:N
        ST[i+1] = S * u_power * d_power
        d_power *= d
        u_power /= u
    end
    
    C = if is_call
        max.(ST .- K, 0.0)
    else
        max.(K .- ST, 0.0)
    end
    
    for _ in 1:N
        for i in 1:length(C)-1
            C[i] = (p * C[i] + (1 - p) * C[i+1]) * disc
        end
        pop!(C)
    end
    
    return C[1]
end

@inline put(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    LeisenReimer(S, K, T, r, σ, N, false)

@inline call(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    LeisenReimer(S, K, T, r, σ, N, true)

export put, call

end