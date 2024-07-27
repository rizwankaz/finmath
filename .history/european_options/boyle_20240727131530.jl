module Boyle

using StaticArrays

function trinomial_tree(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, is_call::Bool)
    dt = T / N
    u = exp(σ * sqrt(2 * dt))
    d = 1 / u
    
    pu = ((exp(r * dt / 2) - exp(-σ * sqrt(dt / 2))) / (exp(σ * sqrt(dt / 2)) - exp(-σ * sqrt(dt / 2))))^2
    pd = ((exp(σ * sqrt(dt / 2)) - exp(r * dt / 2)) / (exp(σ * sqrt(dt / 2)) - exp(-σ * sqrt(dt / 2))))^2
    pm = 1 - pu - pd

    discount = exp(-r * dt)
    
    u_powers = SVector{N+1}([u^i for i in N:-1:0])
    d_powers = SVector{N+1}([d^i for i in 0:N])

    payoff = is_call ? (x -> max(x - K, 0.0)) : (x -> max(K - x, 0.0))
    values = MVector{N+1}([payoff(S * u_powers[i] * d_powers[i]) for i in 1:N+1])

    for i in N-1:-1:0
        for j in 1:i+1
            values[j] = discount * (pu * values[j] + pm * values[j+1] + pd * values[j+2])
        end
    end

    return values[1]
end

call(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    trinomial_tree(S, K, T, r, σ, N, true)

put(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    trinomial_tree(S, K, T, r, σ, N, false)

export call, put

end