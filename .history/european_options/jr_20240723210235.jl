module JR

using SpecialFunctions

function norm_cdf(x::Float64)
    return 0.5 * (1.0 + erf(x / sqrt(2.0)))
end

function JarrowRudd(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, is_call::Bool)
    δt = T / N
    u = exp((r - 0.5 * σ^2) * δt + σ * sqrt(δt))
    d = exp((r - 0.5 * σ^2) * δt - σ * sqrt(δt))
    p = 0.5
    
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

function put(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64)
    return JarrowRudd(S, K, T, r, σ, N, false)
end

function call(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64)
    return JarrowRudd(S, K, T, r, σ, N, true)
end

export put, call

end