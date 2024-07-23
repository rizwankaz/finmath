module MC

using Distributions
using Statistics

function MonteCarlo(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, M::Int64, is_call::Bool)
    dt = T / N
    nudt = (r - 0.5 * σ^2) * dt
    sigdt = σ * sqrt(dt)
    
    ST = zeros(M)
    
    for i in 1:M
        S_t = S
        for j in 1:N
            S_t *= exp(nudt + sigdt * randn())
        end
        ST[i] = S_t
    end
    
    if is_call
        payoffs = max.(ST .- K, 0.0)
    else
        payoffs = max.(K .- ST, 0.0)
    end
    
    option_price = exp(-r * T) * mean(payoffs)
    
    return option_price
end

function MCcall(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, M::Int64)
    return monte_carlo(S, K, T, r, σ, N, M, true)
end

function MCput(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, M::Int64)
    return monte_carlo(S, K, T, r, σ, N, M, false)
end

export MCcall, MCput

end