module MC

using Distributions
using Statistics

function MonteCarlo(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, M::Int64, is_call::Bool)
    dt = T / N
    nudt = (r - 0.5 * σ^2) * dt
    sigdt = σ * sqrt(dt)
    
    payoff = is_call ? x -> max(x - K, 0.0) : x -> max(K - x, 0.0)
    
    function simulate_path()
        S_t = S
        for _ in 1:N
            S_t *= exp(nudt + sigdt * randn())
        end
        return payoff(S_t)
    end
    
    payoffs = [simulate_path() for _ in 1:M]
    
    return exp(-r * T) * mean(payoffs)
end

call(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, M::Int64) = 
    MonteCarlo(S, K, T, r, σ, N, M, true)

put(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, M::Int64) = 
    MonteCarlo(S, K, T, r, σ, N, M, false)

export call, put

end