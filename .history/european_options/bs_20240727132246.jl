module BS

using Distributions

const N = Normal()

function blackScholes(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, is_call::Bool)
    σ_sqrt_T = σ * sqrt(T)
    d1 = (log(S / K) + (r + 0.5 * σ^2) * T) / σ_sqrt_T
    d2 = d1 - σ_sqrt_T
    
    Nd1 = cdf(N, d1)
    Nd2 = cdf(N, d2)
    
    if is_call
        return S * Nd1 - K * exp(-r * T) * Nd2
    else
        return K * exp(-r * T) * (1 - Nd2) - S * (1 - Nd1)
    end
end

@inline put(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64) = 
    blackScholes(S, K, T, r, σ, false)

@inline call(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64) = 
    blackScholes(S, K, T, r, σ, true)

export put, call

end