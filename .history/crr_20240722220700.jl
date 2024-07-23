function CRR(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64, is_call::Bool)
    δt = T / N
    u = exp(σ * sqrt(δt))
    d = 1 / u
    p = (exp(r * δt) - d) / (u - d)

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

CRRput(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    CRR(S, K, T, r, σ, N, false)

CRRcall(S::Float64, K::Float64, T::Float64, r::Float64, σ::Float64, N::Int64) = 
    CRR(S, K, T, r, σ, N, true)

S = 100.0  # Current stock price
K = 100.0  # Strike price
T = 1.0    # Time to maturity (in years)
r = 0.05   # Risk-free rate
σ = 0.2    # Volatility
N = 1000   # Number of time steps

call_price = CRRcall(S, K, T, r, σ, N)
put_price = CRRput(S, K, T, r, σ, N)

println("CRR Call Price: ", call_price)
println("CRR Put Price: ", put_price)