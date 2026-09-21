@extends('base')

@section('content')
<h1>Les questions</h1>

@if (session('status'))
    <div class="alert alert-success">{{ session('status') }}</div>
@endif

<table class="table">
    <thead>
        <tr>
            <th>Sport</th>
            <th>Difficulté</th>
            <th>Question</th>
            <th>Bonne réponse</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($questions as $question)
            <tr>
                <td>{{ $question->categorie->nom ?? '—' }}</td>
                <td>{{ ucfirst($question->difficulte) }}</td>
                <td>{{ $question->question }}</td>
                <td>{{ $question->bonne_reponse }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endsection
